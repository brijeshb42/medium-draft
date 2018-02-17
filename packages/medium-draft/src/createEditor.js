import PropTypes from 'prop-types';
import React from 'react';
import { Editor, EditorState, RichUtils, SelectionState } from 'draft-js';

import AddButton from './components/addbutton';
import Toolbar, { BLOCK_BUTTONS, INLINE_BUTTONS } from './components/toolbar';
import rendererFn from './components/customrenderer';
import ImageButton from './components/sides/image';
import LinkEditComponent from './components/LinkEditComponent';

import { isCursorBetweenLink } from './model';
import { Block, Entity as E } from './util/constants';
import beforeInput, { StringToTypeMap } from './util/beforeinput';
import keyBindingFnProp from './util/keybinding';
import customStyleMap from './util/customstylemap';
import RenderMap from './util/rendermap';
import blockStyleFnProp from './util/blockStyleFn';

import defaultHandlers from './handlers/';


const merge = (obj2, obj3) => {
  const res = {};
  // eslint-disable-next-line
  for (const prop in obj2) {
    if (Object.hasOwnProperty.call(obj2, prop)) {
      res[prop] = obj2[prop];
    }
  }
  // eslint-disable-next-line
  for (const prop in obj3) {
    if (Object.hasOwnProperty.call(obj3, prop)) {
      res[prop] = obj3[prop];
    }
  }
  return res;
};

const createEditor = (defHandlers = {}) => {
  const handlers = merge(defaultHandlers, defHandlers);

  class MediumDraftEditor extends React.Component {
    static propTypes = {
      beforeInput: PropTypes.func,
      keyBindingFn: PropTypes.func,
      /* eslint-disable react/forbid-prop-types */
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
        component: PropTypes.func.isRequired,
      })),
      // eslint-disable-next-line
      editorState: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      /* eslint-disable react/require-default-props */
      handleKeyCommand: PropTypes.func,
      handleReturn: PropTypes.func,
      handlePastedText: PropTypes.func,
      /* eslint-enable react/require-default-props */
      disableToolbar: PropTypes.bool,
      showLinkEditToolbar: PropTypes.bool,
      toolbarConfig: PropTypes.object,
      processURL: PropTypes.func,
      /* eslint-enable react/forbid-prop-types */
    };

    static defaultProps = {
      beforeInput,
      customStyleMap,
      rendererFn,
      keyBindingFn: keyBindingFnProp,
      blockStyleFn: blockStyleFnProp,
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
      processURL: (url) => {
        if (url.indexOf('http') === -1) {
          if (url.indexOf('@') >= 0) {
            return `mailto:${url}`;
          }
          return `http://${url}`;
        }
        return url;
      },
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

      this.handlers = {};

      // eslint-disable-next-line
      for (const handler in handlers) {
        if (Object.prototype.hasOwnProperty.call(handlers, handler)) {
          this.handlers[handler] = (...args) => (
            handlers[handler](...args, this._getCommonData())
          );
        }
      }
    }

    /**
     * Adds a hyperlink on the selected text.
     */
    setLink = (url) => {
      let { editorState } = this.props;
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      let entityKey = null;
      const newUrl = this.props.processURL(url);
      if (newUrl !== '') {
        const contentWithEntity = content.createEntity(E.LINK, 'MUTABLE', { url: newUrl });
        editorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
        entityKey = contentWithEntity.getLastCreatedEntityKey();
      }
      this.onChange(
        RichUtils.toggleLink(editorState, selection, entityKey),
        this.focus,
      );
    }

    _reposition = (oldScrollY) => {
      const { scrollY } = window;
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
      rendererFn: this.props.rendererFn,
      blockStyleFn: this.props.blockStyleFn,
      keyBindingFn: this.props.keyBindingFn,
    });

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
      this.onChange(RichUtils.toggleBlockType(
        this.props.editorState,
        blockType,
      ));
    }

    /*
    The function documented in `draft-js` to be used to toggle inline styles of selection (mainly
    for some key combinations handled by default inside draft-js).
    */
    _toggleInlineStyle(inlineStyle) {
      this.onChange(RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle,
      ));
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
      const {
        editorState, editorEnabled, disableToolbar, showLinkEditToolbar, toolbarConfig,
      } = this.props;
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
              {...this.handlers}
              editorState={editorState}
              onChange={this.onChange}
              blockRenderMap={this.props.blockRenderMap}
              customStyleMap={this.props.customStyleMap}
              readOnly={!editorEnabled}
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

  return MediumDraftEditor;
};

export default createEditor;
