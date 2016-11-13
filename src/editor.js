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
import {
  Block,
  Entity as E,
  HANDLED,
  NOT_HANDLED,
  KEY_COMMANDS } from './util/constants';
import beforeInput, { StringToTypeMap } from './util/beforeinput';
import blockStyleFn from './util/blockStyleFn';
import { getCurrentBlock, resetBlockWithType, addNewBlockAt } from './model';

import ImageButton from './components/sides/image';

/*
A wrapper over `draft-js`'s default **Editor** component which provides
some built-in customisations like custom blocks (todo, caption, etc) and
some key handling for ease of use so that users' mouse usage is minimum.
*/
class MediumDraftEditor extends React.Component {

  static propTypes = {
    beforeInput: PropTypes.func,
    keyBindingFn: PropTypes.func,
    customStyleMap: PropTypes.object,
    blockStyleFn: PropTypes.func,
    rendererFn: PropTypes.func,
    editorEnabled: PropTypes.bool,
    spellCheck: PropTypes.bool,
    stringToTypeMap: PropTypes.object,
    blockRenderMap: PropTypes.object,
    blockButtons: PropTypes.arrayOf(PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      style: React.PropTypes.string.isRequired,
      icon: React.PropTypes.string,
      description: React.PropTypes.string,
    })),
    inlineButtons: PropTypes.arrayOf(PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      style: React.PropTypes.string.isRequired,
      icon: React.PropTypes.string,
      description: React.PropTypes.string,
    })),
    placeholder: PropTypes.string,
    continuousBlocks: PropTypes.arrayOf(PropTypes.string),
    sideButtons: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      component: PropTypes.func,
    })),
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    handleKeyCommand: PropTypes.func,
    handleReturn: PropTypes.func,
    disableToolbar: PropTypes.bool,
  };

  static defaultProps = {
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
    disableToolbar: false,
  };

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
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.setLink = this.setLink.bind(this);
    this.blockRendererFn = this.props.rendererFn(this.onChange, this.getEditorState);
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
      if (url.indexOf('http') === -1) {
        if (url.indexOf('@') >= 0) {
          newUrl = `mailto:${newUrl}`;
        } else {
          newUrl = `http://${newUrl}`;
        }
      }
      entityKey = Entity.create(E.LINK, 'MUTABLE', { url: newUrl });
    }
    this.onChange(RichUtils.toggleLink(editorState, selection, entityKey), this.focus);
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
  - toggleinline:inline-type -> If the command starts with `toggleinline:` and
    then succeeded by the inline type, the current selection's inline type will be
    togglled.
  */
  handleKeyCommand(command) {
    // console.log(command);
    if (this.props.handleKeyCommand) {
      const behaviour = this.props.handleKeyCommand(command);
      if (behaviour === HANDLED || behaviour === true) {
        return HANDLED;
      }
    }
    if (command === KEY_COMMANDS.showLinkInput()) {
      if (!this.props.disableToolbar && this.toolbar) {
        this.toolbar.handleLinkInput(null, true);
        return HANDLED;
      }
      return NOT_HANDLED;
    }
    /* else if (command === KEY_COMMANDS.addNewBlock()) {
      const { editorState } = this.props;
      this.onChange(addNewBlock(editorState, Block.BLOCKQUOTE));
      return HANDLED;
    } */
    const { editorState } = this.props;
    const block = getCurrentBlock(editorState);
    const currentBlockType = block.getType();
    // if (command === KEY_COMMANDS.deleteBlock()) {
    //   if (currentBlockType.indexOf(Block.ATOMIC) === 0 && block.getText().length === 0) {
    //     this.onChange(resetBlockWithType(editorState, Block.UNSTYLED, { text: '' }));
    //     return HANDLED;
    //   }
    //   return NOT_HANDLED;
    // }
    if (command.indexOf(`${KEY_COMMANDS.changeType()}`) === 0) {
      let newBlockType = command.split(':')[1];
      // const currentBlockType = block.getType();
      if (currentBlockType === Block.ATOMIC) {
        return HANDLED;
      }
      if (currentBlockType === Block.BLOCKQUOTE && newBlockType === Block.CAPTION) {
        newBlockType = Block.BLOCKQUOTE_CAPTION;
      } else if (currentBlockType === Block.BLOCKQUOTE_CAPTION && newBlockType === Block.CAPTION) {
        newBlockType = Block.BLOCKQUOTE;
      }
      this.onChange(RichUtils.toggleBlockType(editorState, newBlockType));
      return HANDLED;
    } else if (command.indexOf(`${KEY_COMMANDS.toggleInline()}`) === 0) {
      const inline = command.split(':')[1];
      this._toggleInlineStyle(inline);
      return HANDLED;
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return HANDLED;
    }
    return NOT_HANDLED;
  }

  /*
  This function is responsible for emitting various commands based on various key combos.
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
    if (this.props.handleReturn) {
      const behavior = this.props.handleReturn();
      if (behavior === HANDLED || behavior === true) {
        return HANDLED;
      }
    }
    const { editorState } = this.props;
    if (isSoftNewlineEvent(e)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return HANDLED;
    }
    if (!e.altKey && !e.metaKey && !e.ctrlKey) {
      const currentBlock = getCurrentBlock(editorState);
      const blockType = currentBlock.getType();

      if (blockType.indexOf(Block.ATOMIC) === 0) {
        this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
        return HANDLED;
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
            return HANDLED;
          default:
            return NOT_HANDLED;
        }
      }

      const selection = editorState.getSelection();

      if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
        if (this.props.continuousBlocks.indexOf(blockType) < 0) {
          this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
          return HANDLED;
        }
        return NOT_HANDLED;
      }
      return NOT_HANDLED;
    }
    return NOT_HANDLED;
  }


  /*
  The function documented in `draft-js` to be used to toggle block types (mainly
  for some key combinations handled by default inside draft-js).
  */
  _toggleBlockType(blockType) {
    const type = RichUtils.getCurrentBlockType(this.props.editorState);
    if (type.indexOf(`${Block.ATOMIC}:`) === 0) {
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
    if (type.indexOf(Block.H1.split('-')[0]) === 0) {
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
    const { editorState, editorEnabled, disableToolbar } = this.props;
    const showAddButton = editorEnabled;
    const editorClass = `md-RichEditor-editor${!editorEnabled ? ' md-RichEditor-readonly' : ''}`;
    return (
      <div className="md-RichEditor-root">
        <div className={editorClass}>
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
            handleReturn={this.handleReturn}
            customStyleMap={this.props.customStyleMap}
            readOnly={!editorEnabled}
            keyBindingFn={this.props.keyBindingFn}
            placeholder={this.props.placeholder}
            spellCheck={editorEnabled && this.props.spellCheck}
          />
          {this.props.sideButtons.length > 0 && showAddButton && (
            <AddButton
              editorState={editorState}
              getEditorState={this.getEditorState}
              setEditorState={this.onChange}
              focus={this.focus}
              sideButtons={this.props.sideButtons}
            />
          )}
          {!disableToolbar && (
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
          )}
        </div>
      </div>
    );
  }
}

export default MediumDraftEditor;
