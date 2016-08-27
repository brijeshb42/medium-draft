import React, { PropTypes } from 'react';
import {
  Editor,
  RichUtils,
  Entity,
} from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';

import AddButton from './components/addbutton';
import Toolbar, { BLOCK_BUTTONS, INLINE_BUTTONS } from './components/toolbar';

import rendererFn from './components/customrenderer';
import customStyleMap from './util/customstylemap';
import RenderMap from './util/rendermap';
import keyBindingFn from './util/keybinding';
import { Block, Entity as E } from './util/constants';
import beforeInput, { StringToTypeMap } from './util/beforeinput';
import blockStyleFn from './util/blockStyleFn';
import { getCurrentBlock, addNewBlock, resetBlockWithType, addNewBlockAt } from './model';

import ImageButton from './components/sides/image';

/*
A wrapper over `draft-js`'s default **Editor*component which provides
some built-in customisations like custom blocks (todo, caption, etc) and
some key handling for ease of use so that users' mouse usage is minimum.
*/
class MediumDraftEditor extends React.Component {

  constructor(props) {
    super(props);

    this.focus = () => this._editorNode.focus();
    this.onChange = (editorState) => {
      this.props.onChange(editorState);
    };

    this.getEditorState = () => this.props.editorState;

    this.onTab = this.onTab.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.setLink = this.setLink.bind(this);
    this.addMedia = this.addMedia.bind(this);
    this.blockRendererFn = this.props.rendererFn(this.onChange, this.getEditorState);
  }

  componentDidMount() {
    this.focus();
  }


  /*
  Implemented to provide nesting of upto 2 levels in ULs or OLs.
  */
  onTab(e) {
    const { editorState } = this.props;
    const newEditorState = RichUtils.onTab(e, editorState, 2);
    if (newEditorState !== editorState) {
      this.onChange(newEditorState);
    }
  }

  /*
  Adds a hyperlink on the selected text with some basic checks.
  */
  setLink(url) {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    let entityKey = null;
    let newUrl = url;
    if (url !== '') {
      if (url.indexOf('@') >= 0) {
        newUrl = `mailto:${newUrl}`;
      } else if (url.indexOf('http') === -1) {
        newUrl = `http://${newUrl}`;
      }
      entityKey = Entity.create(E.LINK, 'MUTABLE', { url: newUrl });
    }
    this.onChange(RichUtils.toggleLink(editorState, selection, entityKey), this.focus);
  }

  addMedia() {
    // const src = window.prompt('Enter a URL');
    // if (!src) {
    //   return;
    // }
    // const entityKey = Entity.create('image', 'IMMUTABLE', {src});
    // this.onChange(
    //   AtomicBlockUtils.insertAtomicBlock(
    //     this.props.editorState,
    //     entityKey,
    //     ' '
    //   )
    // );
  }


  /*
  Implemented to just pass it on to the parent component. Will add some
  customizations later or as when needed.
  */
  handleDroppedFiles(selection, files) {
    if (this.props.handleDroppedFiles) {
      this.props.handleDroppedFiles(selection, files);
    }
  }

  /*
  Handles custom commands based on various key combinations. First checks
  for some built-in commands. If found, that command's function is apllied and returns.
  If not found, it checks whether parent component handles that command or not.
  Some of the internal commands are:

  - showlinkinput -> Opens up the link input tooltip if some text is selected.
  - add-new-block -> Adds a new block at the current cursor position.
  - changetype:block-type -> If the command starts with `changetype:` and
    then succeeded by the block type, the current block will be converted to that particular type.
  - toggleinline:inlint-type -> If the command starts with `toggleinline:` and
    then succeeded by the inline type, the current selection's inline type will be
    togglled.
  */
  handleKeyCommand(command) {
    // console.log(command);
    if (this.props.handleKeyCommand && this.props.handleKeyCommand(command)) {
      return true;
    }
    if (command === 'showlinkinput') {
      if (this.toolbar) {
        this.toolbar.handleLinkInput(null, true);
      }
      return true;
    } else if (command === 'add-new-block') {
      const { editorState } = this.props;
      this.onChange(addNewBlock(editorState, Block.BLOCKQUOTE));
      return true;
    }
    const { editorState } = this.props;
    const block = getCurrentBlock(editorState);
    if (command.indexOf('changetype:') === 0) {
      let newBlockType = command.split(':')[1];
      const currentBlockType = block.getType();
      if (currentBlockType === Block.ATOMIC || currentBlockType === 'media') {
        return false;
      }
      if (currentBlockType === Block.BLOCKQUOTE && newBlockType === Block.CAPTION) {
        newBlockType = Block.BLOCKQUOTE_CAPTION;
      } else if (currentBlockType === Block.BLOCKQUOTE_CAPTION && newBlockType === Block.CAPTION) {
        newBlockType = Block.BLOCKQUOTE;
      }
      this.onChange(RichUtils.toggleBlockType(editorState, newBlockType));
      return true;
    } else if (command.indexOf('toggleinline:') === 0) {
      const inline = command.split(':')[1];
      this._toggleInlineStyle(inline);
      return true;
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  /*
  This command is responsible for emmitting various commands based on various key combos.
  */
  handleBeforeInput(str) {
    return this.props.beforeInput(
      this.props.editorState, str, this.onChange, this.props.stringToTypeMap);
  }

  /*
  By default, it handles return key for inserting soft breaks (BRs in HTML) and
  also instead of inserting a new empty block after current empty block, it first check
  whether the current block is of a type other than `unstyled`. If yes, current block is
  simply converted to an unstyled empty block. If RETURN is pressed on an unstyled block
  default behavior is executed.
  */
  handleReturn(e) {
    const { editorState } = this.props;
    if (isSoftNewlineEvent(e)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return true;
    }
    if (!e.altKey && !e.metaKey && !e.ctrlKey) {
      const currentBlock = getCurrentBlock(editorState);
      const blockType = currentBlock.getType();

      if (blockType.indexOf('atomic') === 0) {
        this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
        return true;
      }

      if (currentBlock.getLength() === 0) {
        switch (blockType) {
          case Block.UL:
          case Block.OL:
          case Block.BLOCKQUOTE:
          case Block.BLOCKQUOTE_CAPTION:
          case Block.CAPTION:
          case Block.TODO:
          case Block.H2:
          case Block.H3:
          case Block.H1:
            this.onChange(resetBlockWithType(editorState, Block.UNSTYLED));
            return true;
          default:
            return false;
        }
      }

      const selection = editorState.getSelection();

      if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
        if (this.props.continuousBlocks.indexOf(blockType) < 0) {
          this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }


  /*
  The function documented in `draft-js` to be used to toggle block types (mainly
  for some key combinations handled by default inside draft-js).
  */
  _toggleBlockType(blockType) {
    const type = RichUtils.getCurrentBlockType(this.props.editorState);
    if (type.indexOf('atomic:') === 0) {
      return;
    }
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }

  /*
  The function documented in `draft-js` to be used to toggle inline styles of selection (mainly
  for some key combinations handled by default inside draft-js).
  */
  _toggleInlineStyle(inlineStyle) {
    const type = RichUtils.getCurrentBlockType(this.props.editorState);
    if (type.indexOf('header') === 0) {
      return;
    }
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }


  /*
  Renders the `Editor`, `Toolbar` and the side `AddButton`.
  */
  render() {
    const { editorState, editorEnabled } = this.props;
    // const currentBlockType = RichUtils.getCurrentBlockType(this.props.editorState);
    const showAddButton = editorEnabled; // && currentBlockType.indexOf('atomic:') < 0;
    return (
      <div className="RichEditor-root">
        <div className="RichEditor-editor">
          <Editor
            ref={(node) => { this._editorNode = node; }}
            {...this.props}
            editorState={editorState}
            blockRendererFn={this.blockRendererFn}
            blockStyleFn={this.props.blockStyleFn}
            onChange={this.onChange}
            onTab={this.onTab}
            blockRenderMap={this.props.blockRenderMap}
            handleKeyCommand={this.handleKeyCommand}
            handleBeforeInput={this.handleBeforeInput}
            handleDroppedFiles={this.handleDroppedFiles}
            handleReturn={this.handleReturn}
            customStyleMap={this.props.customStyleMap}
            readOnly={!editorEnabled}
            keyBindingFn={this.props.keyBindingFn}
            placeholder={this.props.placeholder}
            spellCheck={editorEnabled && this.props.spellCheck}
          />
          {showAddButton ? (
            <AddButton
              addMedia={this.addMedia}
              editorState={editorState}
              getEditorState={this.getEditorState}
              setEditorState={this.onChange}
              focus={this.focus}
              sideButtons={this.props.sideButtons}
            />
          ) : null}
          <Toolbar
            ref={(c) => { this.toolbar = c; }}
            editorNode={this._editorNode}
            editorState={editorState}
            toggleBlockType={this.toggleBlockType}
            toggleInlineStyle={this.toggleInlineStyle}
            editorEnabled={editorEnabled}
            setLink={this.setLink}
            focus={this.focus}
            blockButtons={this.props.blockButtons}
            inlineButtons={this.props.inlineButtons}
          />
        </div>
      </div>
    );
  }
}

MediumDraftEditor.propTypes = {
  beforeInput: PropTypes.func,
  keyBindingFn: PropTypes.func,
  customStyleMap: PropTypes.object,
  blockStyleFn: PropTypes.func,
  rendererFn: PropTypes.func,
  editorEnabled: PropTypes.bool,
  spellCheck: PropTypes.bool,
  stringToTypeMap: PropTypes.object,
  blockRenderMap: PropTypes.object,
  blockButtons: PropTypes.array,
  inlineButtons: PropTypes.array,
  placeholder: PropTypes.string,
  continuousBlocks: PropTypes.arrayOf(PropTypes.string),
  sideButtons: PropTypes.arrayOf(PropTypes.object),
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  handleDroppedFiles: PropTypes.func,
  handleKeyCommand: PropTypes.func,
};

MediumDraftEditor.defaultProps = {
  beforeInput,
  keyBindingFn,
  customStyleMap,
  blockStyleFn,
  rendererFn,
  editorEnabled: true,
  spellCheck: true,
  stringToTypeMap: StringToTypeMap,
  blockRenderMap: RenderMap,
  blockButtons: BLOCK_BUTTONS,
  inlineButtons: INLINE_BUTTONS,
  placeholder: 'Write your story...',
  continuousBlocks: [
    Block.UNSTYLED,
    Block.BLOCKQUOTE,
    Block.OL,
    Block.UL,
    Block.CODE,
    Block.TODO,
  ],
  sideButtons: [
    {
      title: 'Image',
      component: ImageButton,
    },
  ],
};


export default MediumDraftEditor;
