'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _isSoftNewlineEvent = require('draft-js/lib/isSoftNewlineEvent');

var _isSoftNewlineEvent2 = _interopRequireDefault(_isSoftNewlineEvent);

var _immutable = require('immutable');

var _addbutton = require('./components/addbutton');

var _addbutton2 = _interopRequireDefault(_addbutton);

var _toolbar = require('./components/toolbar');

var _toolbar2 = _interopRequireDefault(_toolbar);

var _LinkEditComponent = require('./components/LinkEditComponent');

var _LinkEditComponent2 = _interopRequireDefault(_LinkEditComponent);

var _customrenderer = require('./components/customrenderer');

var _customrenderer2 = _interopRequireDefault(_customrenderer);

var _customstylemap = require('./util/customstylemap');

var _customstylemap2 = _interopRequireDefault(_customstylemap);

var _rendermap = require('./util/rendermap');

var _rendermap2 = _interopRequireDefault(_rendermap);

var _keybinding = require('./util/keybinding');

var _keybinding2 = _interopRequireDefault(_keybinding);

var _constants = require('./util/constants');

var _beforeinput = require('./util/beforeinput');

var _beforeinput2 = _interopRequireDefault(_beforeinput);

var _blockStyleFn = require('./util/blockStyleFn');

var _blockStyleFn2 = _interopRequireDefault(_blockStyleFn);

var _model = require('./model');

var _image = require('./components/sides/image');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
A wrapper over `draft-js`'s default **Editor** component which provides
some built-in customisations like custom blocks (todo, caption, etc) and
some key handling for ease of use so that users' mouse usage is minimum.
*/
var MediumDraftEditor = function (_React$Component) {
  _inherits(MediumDraftEditor, _React$Component);

  function MediumDraftEditor(props) {
    _classCallCheck(this, MediumDraftEditor);

    var _this = _possibleConstructorReturn(this, (MediumDraftEditor.__proto__ || Object.getPrototypeOf(MediumDraftEditor)).call(this, props));

    _this.onUpArrow = function (e) {
      var editorState = _this.props.editorState;

      var content = editorState.getCurrentContent();
      var selection = editorState.getSelection();
      var key = selection.getAnchorKey();
      var currentBlock = content.getBlockForKey(key);
      var firstBlock = content.getFirstBlock();
      if (firstBlock.getKey() === key) {
        if (firstBlock.getType().indexOf(_constants.Block.ATOMIC) === 0) {
          e.preventDefault();
          var newBlock = new _draftJs.ContentBlock({
            type: _constants.Block.UNSTYLED,
            key: (0, _draftJs.genKey)()
          });
          var newBlockMap = (0, _immutable.OrderedMap)([[newBlock.getKey(), newBlock]]).concat(content.getBlockMap());
          var newContent = content.merge({
            blockMap: newBlockMap,
            selectionAfter: selection.merge({
              anchorKey: newBlock.getKey(),
              focusKey: newBlock.getKey(),
              anchorOffset: 0,
              focusOffset: 0,
              isBackward: false
            })
          });
          _this.onChange(_draftJs.EditorState.push(editorState, newContent, 'insert-characters'));
        }
      } else if (currentBlock.getType().indexOf(_constants.Block.ATOMIC) === 0) {
        var blockBefore = content.getBlockBefore(key);
        if (!blockBefore) {
          return;
        }
        e.preventDefault();
        var newSelection = selection.merge({
          anchorKey: blockBefore.getKey(),
          focusKey: blockBefore.getKey(),
          anchorOffset: blockBefore.getLength(),
          focusOffset: blockBefore.getLength(),
          isBackward: false
        });
        _this.onChange(_draftJs.EditorState.forceSelection(editorState, newSelection));
      }
    };

    _this.removeLink = function (blockKey, entityKey) {
      var editorState = _this.props.editorState;

      var content = editorState.getCurrentContent();
      var block = content.getBlockForKey(blockKey);
      var oldSelection = editorState.getSelection();
      block.findEntityRanges(function (character) {
        var eKey = character.getEntity();
        return eKey === entityKey;
      }, function (start, end) {
        var selection = new _draftJs.SelectionState({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end
        });
        var newEditorState = _draftJs.EditorState.forceSelection(_draftJs.RichUtils.toggleLink(editorState, selection, null), oldSelection);
        _this.onChange(newEditorState, _this.focus);
      });
    };

    _this.editLinkAfterSelection = function (blockKey) {
      var entityKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (entityKey === null) {
        return;
      }
      var editorState = _this.props.editorState;

      var content = editorState.getCurrentContent();
      var block = content.getBlockForKey(blockKey);
      block.findEntityRanges(function (character) {
        var eKey = character.getEntity();
        return eKey === entityKey;
      }, function (start, end) {
        var selection = new _draftJs.SelectionState({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end
        });
        var newEditorState = _draftJs.EditorState.forceSelection(editorState, selection);
        _this.onChange(newEditorState);
        setTimeout(function () {
          if (_this.toolbar) {
            _this.toolbar.handleLinkInput(null, true);
          }
        }, 100);
      });
    };

    _this.handlePastedText = function (text, html, es) {
      var currentBlock = (0, _model.getCurrentBlock)(_this.props.editorState);
      if (currentBlock.getType() === _constants.Block.IMAGE) {
        var editorState = _this.props.editorState;

        var content = editorState.getCurrentContent();
        _this.onChange(_draftJs.EditorState.push(editorState, _draftJs.Modifier.insertText(content, editorState.getSelection(), text)));
        return _constants.HANDLED;
      }
      if (_this.props.handlePastedText && _this.props.handlePastedText(text, html, es) === _constants.HANDLED) {
        return _constants.HANDLED;
      }
      return _constants.NOT_HANDLED;
    };

    _this.renderAddButton = function (editorState) {
      if (_this.props.addButton) {
        return _this.props.addButton({
          editorState: editorState,
          getEditorState: _this.getEditorState,
          setEditorState: _this.onChange,
          focus: _this.focus,
          sideButtons: _this.props.sideButtons
        });
      }

      return _react2.default.createElement(_addbutton2.default, {
        editorState: editorState,
        getEditorState: _this.getEditorState,
        setEditorState: _this.onChange,
        focus: _this.focus,
        sideButtons: _this.props.sideButtons
      });
    };

    _this.focus = function () {
      return _this._editorNode.focus();
    };
    _this.onChange = function (editorState, cb) {
      _this.props.onChange(editorState, cb);
    };

    _this.getEditorState = function () {
      return _this.props.editorState;
    };

    _this.onTab = _this.onTab.bind(_this);
    _this.handleKeyCommand = _this.handleKeyCommand.bind(_this);
    _this.handleBeforeInput = _this.handleBeforeInput.bind(_this);
    _this.handleReturn = _this.handleReturn.bind(_this);
    _this.toggleBlockType = _this._toggleBlockType.bind(_this);
    _this.toggleInlineStyle = _this._toggleInlineStyle.bind(_this);
    _this.setLink = _this.setLink.bind(_this);
    _this.blockRendererFn = _this.props.rendererFn(_this.onChange, _this.getEditorState);
    return _this;
  }

  /**
   * Implemented to provide nesting of upto 2 levels in ULs or OLs.
   */


  _createClass(MediumDraftEditor, [{
    key: 'onTab',
    value: function onTab(e) {
      var editorState = this.props.editorState;

      var newEditorState = _draftJs.RichUtils.onTab(e, editorState, 2);
      if (newEditorState !== editorState) {
        this.onChange(newEditorState);
      }
    }
  }, {
    key: 'setLink',


    /*
    Adds a hyperlink on the selected text with some basic checks.
    */
    value: function setLink(url) {
      var editorState = this.props.editorState;

      var selection = editorState.getSelection();
      var content = editorState.getCurrentContent();
      var entityKey = null;
      var newUrl = url;
      if (url !== '') {
        if (url.indexOf('http') === -1) {
          if (url.indexOf('@') >= 0) {
            newUrl = 'mailto:' + newUrl;
          } else {
            newUrl = 'http://' + newUrl;
          }
        }
        var contentWithEntity = content.createEntity(_constants.Entity.LINK, 'MUTABLE', { url: newUrl });
        editorState = _draftJs.EditorState.push(editorState, contentWithEntity, 'create-entity');
        entityKey = contentWithEntity.getLastCreatedEntityKey();
      }
      this.onChange(_draftJs.RichUtils.toggleLink(editorState, selection, entityKey), this.focus);
    }

    /**
     * Override which text modifications are available according BLOCK_BUTTONS style property.
     * Defaults all of them if no toolbarConfig.block passed:
     *   block: ['ordered-list-item', 'unordered-list-item', 'blockquote', 'header-three', 'todo'],
     * Example parameter: toolbarConfig = {
     *   block: ['ordered-list-item', 'unordered-list-item'],
     *   inline: ['BOLD', 'ITALIC', 'UNDERLINE', 'hyperlink'],
     * };
     */

  }, {
    key: 'configureToolbarBlockOptions',
    value: function configureToolbarBlockOptions(toolbarConfig) {
      return toolbarConfig && toolbarConfig.block ? toolbarConfig.block.map(function (type) {
        return _toolbar.BLOCK_BUTTONS.find(function (button) {
          return button.style === type;
        });
      }).filter(function (button) {
        return button !== undefined;
      }) : this.props.blockButtons;
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

  }, {
    key: 'configureToolbarInlineOptions',
    value: function configureToolbarInlineOptions(toolbarConfig) {
      return toolbarConfig && toolbarConfig.inline ? toolbarConfig.inline.map(function (type) {
        return _toolbar.INLINE_BUTTONS.find(function (button) {
          return button.style === type;
        });
      }).filter(function (button) {
        return button !== undefined;
      }) : this.props.inlineButtons;
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

  }, {
    key: 'handleKeyCommand',
    value: function handleKeyCommand(command) {
      // console.log(command);
      var editorState = this.props.editorState;

      if (this.props.handleKeyCommand) {
        var behaviour = this.props.handleKeyCommand(command);
        if (behaviour === _constants.HANDLED || behaviour === true) {
          return _constants.HANDLED;
        }
      }
      if (command === _constants.KEY_COMMANDS.showLinkInput()) {
        if (!this.props.disableToolbar && this.toolbar) {
          // For some reason, scroll is jumping sometimes for the below code.
          // Debug and fix it later.
          var isCursorLink = (0, _model.isCursorBetweenLink)(editorState);
          if (isCursorLink) {
            this.editLinkAfterSelection(isCursorLink.blockKey, isCursorLink.entityKey);
            return _constants.HANDLED;
          }
          this.toolbar.handleLinkInput(null, true);
          return _constants.HANDLED;
        }
        return _constants.NOT_HANDLED;
      } else if (command === _constants.KEY_COMMANDS.unlink()) {
        var _isCursorLink = (0, _model.isCursorBetweenLink)(editorState);
        if (_isCursorLink) {
          this.removeLink(_isCursorLink.blockKey, _isCursorLink.entityKey);
          return _constants.HANDLED;
        }
      }
      /* else if (command === KEY_COMMANDS.addNewBlock()) {
        const { editorState } = this.props;
        this.onChange(addNewBlock(editorState, Block.BLOCKQUOTE));
        return HANDLED;
      } */
      var block = (0, _model.getCurrentBlock)(editorState);
      var currentBlockType = block.getType();
      // if (command === KEY_COMMANDS.deleteBlock()) {
      //   if (currentBlockType.indexOf(Block.ATOMIC) === 0 && block.getText().length === 0) {
      //     this.onChange(resetBlockWithType(editorState, Block.UNSTYLED, { text: '' }));
      //     return HANDLED;
      //   }
      //   return NOT_HANDLED;
      // }
      if (command.indexOf('' + _constants.KEY_COMMANDS.changeType()) === 0) {
        var newBlockType = command.split(':')[1];
        // const currentBlockType = block.getType();
        if (currentBlockType === _constants.Block.ATOMIC) {
          return _constants.HANDLED;
        }
        if (currentBlockType === _constants.Block.BLOCKQUOTE && newBlockType === _constants.Block.CAPTION) {
          newBlockType = _constants.Block.BLOCKQUOTE_CAPTION;
        } else if (currentBlockType === _constants.Block.BLOCKQUOTE_CAPTION && newBlockType === _constants.Block.CAPTION) {
          newBlockType = _constants.Block.BLOCKQUOTE;
        }
        this.onChange(_draftJs.RichUtils.toggleBlockType(editorState, newBlockType));
        return _constants.HANDLED;
      } else if (command.indexOf('' + _constants.KEY_COMMANDS.toggleInline()) === 0) {
        var inline = command.split(':')[1];
        this._toggleInlineStyle(inline);
        return _constants.HANDLED;
      }
      var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return _constants.HANDLED;
      }
      return _constants.NOT_HANDLED;
    }

    /*
    This function is responsible for emitting various commands based on various key combos.
    */

  }, {
    key: 'handleBeforeInput',
    value: function handleBeforeInput(str) {
      return this.props.beforeInput(this.props.editorState, str, this.onChange, this.props.stringToTypeMap);
    }

    /*
    By default, it handles return key for inserting soft breaks (BRs in HTML) and
    also instead of inserting a new empty block after current empty block, it first check
    whether the current block is of a type other than `unstyled`. If yes, current block is
    simply converted to an unstyled empty block. If RETURN is pressed on an unstyled block
    default behavior is executed.
    */

  }, {
    key: 'handleReturn',
    value: function handleReturn(e) {
      if (this.props.handleReturn) {
        var behavior = this.props.handleReturn();
        if (behavior === _constants.HANDLED || behavior === true) {
          return _constants.HANDLED;
        }
      }
      var editorState = this.props.editorState;

      if ((0, _isSoftNewlineEvent2.default)(e)) {
        this.onChange(_draftJs.RichUtils.insertSoftNewline(editorState));
        return _constants.HANDLED;
      }
      if (!e.altKey && !e.metaKey && !e.ctrlKey) {
        var currentBlock = (0, _model.getCurrentBlock)(editorState);
        var blockType = currentBlock.getType();

        if (blockType.indexOf(_constants.Block.ATOMIC) === 0) {
          this.onChange((0, _model.addNewBlockAt)(editorState, currentBlock.getKey()));
          return _constants.HANDLED;
        }

        if (currentBlock.getLength() === 0) {
          switch (blockType) {
            case _constants.Block.UL:
            case _constants.Block.OL:
            case _constants.Block.BLOCKQUOTE:
            case _constants.Block.BLOCKQUOTE_CAPTION:
            case _constants.Block.CAPTION:
            case _constants.Block.TODO:
            case _constants.Block.H2:
            case _constants.Block.H3:
            case _constants.Block.H1:
              this.onChange((0, _model.resetBlockWithType)(editorState, _constants.Block.UNSTYLED));
              return _constants.HANDLED;
            default:
              return _constants.NOT_HANDLED;
          }
        }

        var selection = editorState.getSelection();

        if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
          if (this.props.continuousBlocks.indexOf(blockType) < 0) {
            this.onChange((0, _model.addNewBlockAt)(editorState, currentBlock.getKey()));
            return _constants.HANDLED;
          }
          return _constants.NOT_HANDLED;
        }
        return _constants.NOT_HANDLED;
      }
      return _constants.NOT_HANDLED;
    }

    /*
    The function documented in `draft-js` to be used to toggle block types (mainly
    for some key combinations handled by default inside draft-js).
    */

  }, {
    key: '_toggleBlockType',
    value: function _toggleBlockType(blockType) {
      var type = _draftJs.RichUtils.getCurrentBlockType(this.props.editorState);
      if (type.indexOf(_constants.Block.ATOMIC + ':') === 0) {
        return;
      }
      this.onChange(_draftJs.RichUtils.toggleBlockType(this.props.editorState, blockType));
    }

    /*
    The function documented in `draft-js` to be used to toggle inline styles of selection (mainly
    for some key combinations handled by default inside draft-js).
    */

  }, {
    key: '_toggleInlineStyle',
    value: function _toggleInlineStyle(inlineStyle) {
      this.onChange(_draftJs.RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle));
    }

    /**
     * Handle pasting when cursor is in an image block. Paste the text as the
     * caption. Otherwise, let Draft do its thing.
     */

  }, {
    key: 'render',


    /*
    Renders the `Editor`, `Toolbar` and the side `AddButton`.
    */
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          editorState = _props.editorState,
          editorEnabled = _props.editorEnabled,
          disableToolbar = _props.disableToolbar,
          showLinkEditToolbar = _props.showLinkEditToolbar,
          toolbarConfig = _props.toolbarConfig;

      var showAddButton = editorEnabled;
      var editorClass = 'md-RichEditor-editor' + (!editorEnabled ? ' md-RichEditor-readonly' : '');
      var isCursorLink = false;
      if (editorEnabled && showLinkEditToolbar) {
        isCursorLink = (0, _model.isCursorBetweenLink)(editorState);
      }
      var blockButtons = this.configureToolbarBlockOptions(toolbarConfig);
      var inlineButtons = this.configureToolbarInlineOptions(toolbarConfig);
      return _react2.default.createElement(
        'div',
        { className: 'md-RichEditor-root' },
        _react2.default.createElement(
          'div',
          { className: editorClass },
          _react2.default.createElement(_draftJs.Editor, _extends({
            ref: function ref(node) {
              _this2._editorNode = node;
            }
          }, this.props, {
            editorState: editorState,
            blockRendererFn: this.blockRendererFn,
            blockStyleFn: this.props.blockStyleFn,
            onChange: this.onChange,
            onTab: this.onTab,
            onUpArrow: this.onUpArrow,
            blockRenderMap: this.props.blockRenderMap,
            handleKeyCommand: this.handleKeyCommand,
            handleBeforeInput: this.handleBeforeInput,
            handleReturn: this.handleReturn,
            handlePastedText: this.handlePastedText,
            customStyleMap: this.props.customStyleMap,
            readOnly: !editorEnabled,
            keyBindingFn: this.props.keyBindingFn,
            placeholder: this.props.placeholder,
            spellCheck: editorEnabled && this.props.spellCheck
          })),
          this.props.sideButtons.length > 0 && showAddButton && this.renderAddButton(editorState),
          !disableToolbar && _react2.default.createElement(_toolbar2.default, {
            ref: function ref(c) {
              _this2.toolbar = c;
            },
            editorNode: this._editorNode,
            editorState: editorState,
            toggleBlockType: this.toggleBlockType,
            toggleInlineStyle: this.toggleInlineStyle,
            editorEnabled: editorEnabled,
            setLink: this.setLink,
            focus: this.focus,
            blockButtons: blockButtons,
            inlineButtons: inlineButtons
          }),
          isCursorLink && _react2.default.createElement(_LinkEditComponent2.default, _extends({}, isCursorLink, {
            editorState: editorState,
            removeLink: this.removeLink,
            editLink: this.editLinkAfterSelection
          }))
        )
      );
    }
  }]);

  return MediumDraftEditor;
}(_react2.default.Component);

MediumDraftEditor.propTypes = {
  beforeInput: _propTypes2.default.func,
  keyBindingFn: _propTypes2.default.func,
  customStyleMap: _propTypes2.default.object,
  blockStyleFn: _propTypes2.default.func,
  rendererFn: _propTypes2.default.func,
  editorEnabled: _propTypes2.default.bool,
  spellCheck: _propTypes2.default.bool,
  stringToTypeMap: _propTypes2.default.object,
  blockRenderMap: _propTypes2.default.object,
  blockButtons: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element, _propTypes2.default.object]),
    style: _propTypes2.default.string.isRequired,
    icon: _propTypes2.default.string,
    description: _propTypes2.default.string
  })),
  inlineButtons: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element, _propTypes2.default.object]),
    style: _propTypes2.default.string.isRequired,
    icon: _propTypes2.default.string,
    description: _propTypes2.default.string
  })),
  placeholder: _propTypes2.default.string,
  continuousBlocks: _propTypes2.default.arrayOf(_propTypes2.default.string),
  addButton: _propTypes2.default.func,
  sideButtons: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    title: _propTypes2.default.string.isRequired,
    component: _propTypes2.default.func
  })),
  editorState: _propTypes2.default.object.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  handleKeyCommand: _propTypes2.default.func,
  handleReturn: _propTypes2.default.func,
  handlePastedText: _propTypes2.default.func,
  disableToolbar: _propTypes2.default.bool,
  showLinkEditToolbar: _propTypes2.default.bool,
  toolbarConfig: _propTypes2.default.object
};
MediumDraftEditor.defaultProps = {
  beforeInput: _beforeinput2.default,
  keyBindingFn: _keybinding2.default,
  customStyleMap: _customstylemap2.default,
  blockStyleFn: _blockStyleFn2.default,
  rendererFn: _customrenderer2.default,
  editorEnabled: true,
  spellCheck: true,
  stringToTypeMap: _beforeinput.StringToTypeMap,
  blockRenderMap: _rendermap2.default,
  blockButtons: _toolbar.BLOCK_BUTTONS,
  inlineButtons: _toolbar.INLINE_BUTTONS,
  placeholder: 'Write your story...',
  continuousBlocks: [_constants.Block.UNSTYLED, _constants.Block.BLOCKQUOTE, _constants.Block.OL, _constants.Block.UL, _constants.Block.CODE, _constants.Block.TODO],
  addButton: null,
  sideButtons: [{
    title: 'Image',
    component: _image2.default
  }],
  disableToolbar: false,
  showLinkEditToolbar: true,
  toolbarConfig: {}
};
exports.default = MediumDraftEditor;