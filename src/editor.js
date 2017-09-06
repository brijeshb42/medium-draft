import PropTypes from 'prop-types';
import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  SelectionState,
} from 'draft-js';

import AddButton from './components/addbutton';
import Toolbar, { BLOCK_BUTTONS, INLINE_BUTTONS } from './components/toolbar';
import LinkEditComponent from './components/LinkEditComponent';

import rendererFn from './components/customrenderer';
import customStyleMap from './util/customstylemap';
import RenderMap from './util/rendermap';
import keyBindingFn from './util/keybinding';
import {
  Block,
  Entity as E,
} from './util/constants';
import beforeInput, { StringToTypeMap } from './util/beforeinput';
import blockStyleFn from './util/blockStyleFn';
import {
  isCursorBetweenLink,
} from './model';

import onTab from './handlers/onTab';
import onUpArrow from './handlers/onUpArrow';
import handlePastedText from './handlers/handlePastedText';
import handleReturn from './handlers/handleReturn';
import handleKeyCommand from './handlers/handleKeyCommand';
import handleBeforeInput from './handlers/handleBeforeInput';

import ImageButton from './components/sides/image';

/**
 * A wrapper over `draft-js`'s default **Editor** component which provides
 * some built-in customisations like custom blocks (todo, caption, etc) and
 * some key handling for ease of use so that users' mouse usage is minimum.
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
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.object,
      ]),
      style: PropTypes.string.isRequired,
      icon: PropTypes.string,
      description: PropTypes.string,
    })),
    inlineButtons: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.object,
      ]),
      style: PropTypes.string.isRequired,
      icon: PropTypes.string,
      description: PropTypes.string,
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
    handlePastedText: PropTypes.func,
    disableToolbar: PropTypes.bool,
    showLinkEditToolbar: PropTypes.bool,
    toolbarConfig: PropTypes.object,
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
    showLinkEditToolbar: true,
    toolbarConfig: {},
  };

  constructor(props) {
    super(props);

    this.focus = () => this._editorNode.focus();
    this.onChange = (editorState, cb) => {
      this.props.onChange(editorState, cb);
    };

    this.getEditorState = () => this.props.editorState;

    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.blockRendererFn = this.props.rendererFn(this.onChange, this.getEditorState);
  }

  onTab = (e) => onTab(e, this._getCommonData());
  onUpArrow = (e) => onUpArrow(e, this._getCommonData());

  /**
   * Adds a hyperlink on the selected text with some basic checks.
   */
  setLink = (url) => {
    let { editorState } = this.props;
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
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
      const contentWithEntity = content.createEntity(E.LINK, 'MUTABLE', { url: newUrl });
      editorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
      entityKey = contentWithEntity.getLastCreatedEntityKey();
    }
    const scrollY = window.scrollY;
    this.onChange(RichUtils.toggleLink(editorState, selection, entityKey), () => {
      this.focus();
      this._reposition(scrollY);
    });
  }

  _reposition = (oldScrollY) => {
    const scrollY = window.scrollY;
    if (scrollY !== oldScrollY) {
      setTimeout(() => {
        window.scrollTo(0, oldScrollY);
      }, 0);
    }
  };

  _getCommonData = () => ({
    getEditorState: this.getEditorState,
    setEditorState: this.onChange,
    focus: this.focus,
    toolbar: this.toolbar,
    editor: this._editorNode,
    reposition: this._reposition,
    continuousBlocks: this.props.continuousBlocks,
    disableToolbar: this.props.disableToolbar,
    beforeInput: this.props.beforeInput,
    stringToTypeMap: this.props.stringToTypeMap,
  });

  handleReturn = (e) => handleReturn(e, this._getCommonData());
  handleKeyCommand = (command) => handleKeyCommand(command, this._getCommonData());
  handleBeforeInput = (str) => handleBeforeInput(str, this._getCommonData());

  /**
   * Override which text modifications are available according BLOCK_BUTTONS style property.
   * Defaults all of them if no toolbarConfig.block passed:
   *   block: ['ordered-list-item', 'unordered-list-item', 'blockquote', 'header-three', 'todo'],
   * Example parameter: toolbarConfig = {
   *   block: ['ordered-list-item', 'unordered-list-item'],
   *   inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink'],
   * };
   */
  configureToolbarBlockOptions(toolbarConfig) {
    return toolbarConfig && toolbarConfig.block
      ? toolbarConfig.block.map(type => BLOCK_BUTTONS.find(button => button.style === type))
        .filter(button => button !== undefined)
      : this.props.blockButtons;
  }

  /**
   * Override which text modifications are available according INLINE_BUTTONS style property.
   * CASE SENSITIVE. Would be good clean up to lowercase inline styles consistently.
   * Defaults all of them if no toolbarConfig.inline passed:
   *   inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink', 'HIGHLIGHT'],
   * Example parameter: toolbarConfig = {
   *   block: ['ordered-list-item', 'unordered-list-item'],
   *   inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink'],
   * };
   */
  configureToolbarInlineOptions(toolbarConfig) {
    return toolbarConfig && toolbarConfig.inline
      ? toolbarConfig.inline.map(type => INLINE_BUTTONS.find(button => button.style === type))
        .filter(button => button !== undefined)
      : this.props.inlineButtons;
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
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  removeLink = (blockKey, entityKey) => {
    const { editorState } = this.props;
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    const oldSelection = editorState.getSelection();
    block.findEntityRanges((character) => {
      const eKey = character.getEntity();
      return eKey === entityKey;
    }, (start, end) => {
      const selection = new SelectionState({
        anchorKey: blockKey,
        focusKey: blockKey,
        anchorOffset: start,
        focusOffset: end,
      });
      const newEditorState = EditorState.forceSelection(RichUtils.toggleLink(editorState, selection, null), oldSelection);
      this.onChange(newEditorState, this.focus);
    });
  };

  editLinkAfterSelection = (blockKey, entityKey = null) => {
    if (entityKey === null) {
      return;
    }
    const { editorState } = this.props;
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    block.findEntityRanges((character) => {
      const eKey = character.getEntity();
      return eKey === entityKey;
    }, (start, end) => {
      const selection = new SelectionState({
        anchorKey: blockKey,
        focusKey: blockKey,
        anchorOffset: start,
        focusOffset: end,
      });
      const newEditorState = EditorState.forceSelection(editorState, selection);
      this.onChange(newEditorState);
      setTimeout(() => {
        if (this.toolbar) {
          this.toolbar.handleLinkInput(null, true);
        }
      }, 100);
    });
  };

  handlePastedText = (text, html, es) => (
    handlePastedText(text, html, es, {
      getEditorState: this.getEditorState,
      setEditorState: this.onChange,
    })
  );

  _editorRefCb = (ref) => {
    this._editorNode = ref;
  };

  _toolbaRefCb = (ref) => {
    this.toolbar = ref;
  };

  /**
   * Renders the `Editor`, `Toolbar` and the side `AddButton`.
   */
  render() {
    const { editorState, editorEnabled, disableToolbar, showLinkEditToolbar, toolbarConfig } = this.props;
    const showAddButton = editorEnabled;
    const editorClass = `md-RichEditor-editor${!editorEnabled ? ' md-RichEditor-readonly' : ''}`;
    let isCursorLink = false;
    if (editorEnabled && showLinkEditToolbar) {
      isCursorLink = isCursorBetweenLink(editorState);
    }
    const blockButtons = this.configureToolbarBlockOptions(toolbarConfig);
    const inlineButtons = this.configureToolbarInlineOptions(toolbarConfig);
    return (
      <div className="md-RichEditor-root">
        <div className={editorClass}>
          <Editor
            ref={this._editorRefCb}
            {...this.props}
            editorState={editorState}
            blockRendererFn={this.blockRendererFn}
            blockStyleFn={this.props.blockStyleFn}
            onChange={this.onChange}
            onTab={this.onTab}
            onUpArrow={this.onUpArrow}
            blockRenderMap={this.props.blockRenderMap}
            handleKeyCommand={this.handleKeyCommand}
            handleBeforeInput={this.handleBeforeInput}
            handleReturn={this.handleReturn}
            handlePastedText={this.handlePastedText}
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
              ref={this._toolbaRefCb}
              editorNode={this._editorNode}
              editorState={editorState}
              toggleBlockType={this.toggleBlockType}
              toggleInlineStyle={this.toggleInlineStyle}
              editorEnabled={editorEnabled}
              setLink={this.setLink}
              focus={this.focus}
              blockButtons={blockButtons}
              inlineButtons={inlineButtons}
            />
          )}
          {isCursorLink && (
            <LinkEditComponent
              {...isCursorLink}
              editorState={editorState}
              removeLink={this.removeLink}
              editLink={this.editLinkAfterSelection}
            />)}
        </div>
      </div>
    );
  }
}

export default MediumDraftEditor;
