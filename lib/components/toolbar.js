'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INLINE_BUTTONS = exports.BLOCK_BUTTONS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _draftJs = require('draft-js');

var _blocktoolbar = require('./blocktoolbar');

var _blocktoolbar2 = _interopRequireDefault(_blocktoolbar);

var _inlinetoolbar = require('./inlinetoolbar');

var _inlinetoolbar2 = _interopRequireDefault(_inlinetoolbar);

var _index = require('../util/index');

var _index2 = require('../model/index');

var _constants = require('../util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import './toolbar.scss';

var Toolbar = function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  function Toolbar(props) {
    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, props));

    _this.state = {
      showURLInput: false,
      urlInputValue: ''
    };

    _this.onKeyDown = _this.onKeyDown.bind(_this);
    _this.onChange = _this.onChange.bind(_this);
    _this.handleLinkInput = _this.handleLinkInput.bind(_this);
    _this.hideLinkInput = _this.hideLinkInput.bind(_this);
    return _this;
  }

  _createClass(Toolbar, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var editorState = newProps.editorState;

      if (!newProps.editorEnabled) {
        return;
      }
      var selectionState = editorState.getSelection();
      if (selectionState.isCollapsed()) {
        if (this.state.showURLInput) {
          this.setState({
            showURLInput: false
          });
        }
        return;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!this.props.editorEnabled || this.state.showURLInput) {
        return;
      }
      var selectionState = this.props.editorState.getSelection();
      if (selectionState.isCollapsed()) {
        return;
      }
      // eslint-disable-next-line no-undef
      var nativeSelection = (0, _index.getSelection)(window);
      if (!nativeSelection.rangeCount) {
        return;
      }
      var selectionBoundary = (0, _index.getSelectionRect)(nativeSelection);

      // eslint-disable-next-line react/no-find-dom-node
      var toolbarNode = _reactDom2.default.findDOMNode(this);
      var toolbarBoundary = toolbarNode.getBoundingClientRect();

      // eslint-disable-next-line react/no-find-dom-node
      var parent = _reactDom2.default.findDOMNode(this.props.editorNode);
      var parentBoundary = parent.getBoundingClientRect();

      /*
      * Main logic for setting the toolbar position.
      */
      toolbarNode.style.top = selectionBoundary.top - parentBoundary.top - toolbarBoundary.height - 5 + 'px';
      toolbarNode.style.width = toolbarBoundary.width + 'px';
      var widthDiff = selectionBoundary.width - toolbarBoundary.width;
      if (widthDiff >= 0) {
        toolbarNode.style.left = widthDiff / 2 + 'px';
      } else {
        var left = selectionBoundary.left - parentBoundary.left;
        toolbarNode.style.left = left + widthDiff / 2 + 'px';
        // toolbarNode.style.width = toolbarBoundary.width + 'px';
        // if (left + toolbarBoundary.width > parentBoundary.width) {
        // toolbarNode.style.right = '0px';
        // toolbarNode.style.left = '';
        // toolbarNode.style.width = toolbarBoundary.width + 'px';
        // }
        // else {
        //   toolbarNode.style.left = (left + widthDiff / 2) + 'px';
        //   toolbarNode.style.right = '';
        // }
      }
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      var _this2 = this;

      if (e.which === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.props.setLink(this.state.urlInputValue);
        this.setState({
          showURLInput: false,
          urlInputValue: ''
        }, function () {
          return _this2.props.focus();
        });
      } else if (e.which === 27) {
        this.hideLinkInput(e);
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      this.setState({
        urlInputValue: e.target.value
      });
    }
  }, {
    key: 'handleLinkInput',
    value: function handleLinkInput(e) {
      var _this3 = this;

      var direct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!direct) {
        e.preventDefault();
        e.stopPropagation();
      }
      var editorState = this.props.editorState;

      var selection = editorState.getSelection();
      if (selection.isCollapsed()) {
        this.props.focus();
        return;
      }
      var currentBlock = (0, _index2.getCurrentBlock)(editorState);
      var selectedEntity = '';
      var linkFound = false;
      currentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        selectedEntity = entityKey;
        return entityKey !== null && _draftJs.Entity.get(entityKey).getType() === _constants.Entity.LINK;
      }, function (start, end) {
        var selStart = selection.getAnchorOffset();
        var selEnd = selection.getFocusOffset();
        if (selection.getIsBackward()) {
          selStart = selection.getFocusOffset();
          selEnd = selection.getAnchorOffset();
        }
        if (start === selStart && end === selEnd) {
          linkFound = true;

          var _Entity$get$getData = _draftJs.Entity.get(selectedEntity).getData(),
              url = _Entity$get$getData.url;

          _this3.setState({
            showURLInput: true,
            urlInputValue: url
          }, function () {
            setTimeout(function () {
              _this3.urlinput.focus();
              _this3.urlinput.select();
            }, 0);
          });
        }
      });
      if (!linkFound) {
        this.setState({
          showURLInput: true
        }, function () {
          setTimeout(function () {
            _this3.urlinput.focus();
          }, 0);
        });
      }
    }
  }, {
    key: 'hideLinkInput',
    value: function hideLinkInput(e) {
      var _this4 = this;

      e.preventDefault();
      e.stopPropagation();
      this.setState({
        showURLInput: false,
        urlInputValue: ''
      }, function () {
        return _this4.props.focus();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          editorState = _props.editorState,
          editorEnabled = _props.editorEnabled,
          inlineButtons = _props.inlineButtons;
      var _state = this.state,
          showURLInput = _state.showURLInput,
          urlInputValue = _state.urlInputValue;

      var isOpen = true;
      if (!editorEnabled || editorState.getSelection().isCollapsed()) {
        isOpen = false;
      }
      if (showURLInput) {
        var className = 'md-editor-toolbar' + (isOpen ? ' md-editor-toolbar--isopen' : '');
        className += ' md-editor-toolbar--linkinput';
        return _react2.default.createElement(
          'div',
          {
            className: className
          },
          _react2.default.createElement(
            'div',
            {
              className: 'md-RichEditor-controls md-RichEditor-show-link-input',
              style: { display: 'block' }
            },
            _react2.default.createElement(
              'span',
              { className: 'md-url-input-close', onMouseDown: this.hideLinkInput },
              '\xD7'
            ),
            _react2.default.createElement('input', {
              ref: function ref(node) {
                _this5.urlinput = node;
              },
              type: 'text',
              className: 'md-url-input',
              onKeyDown: this.onKeyDown,
              onChange: this.onChange,
              placeholder: 'Press ENTER or ESC',
              value: urlInputValue
            })
          )
        );
      }
      var hasHyperLink = false;
      var hyperlinkLabel = '#';
      var hyperlinkDescription = 'Add a link';
      for (var cnt = 0; cnt < inlineButtons.length; cnt++) {
        if (inlineButtons[cnt].style === _constants.HYPERLINK) {
          hasHyperLink = true;
          if (inlineButtons[cnt].label) {
            hyperlinkLabel = inlineButtons[cnt].label;
          }
          if (inlineButtons[cnt].description) {
            hyperlinkDescription = inlineButtons[cnt].description;
          }
          break;
        }
      }
      return _react2.default.createElement(
        'div',
        {
          className: 'md-editor-toolbar' + (isOpen ? ' md-editor-toolbar--isopen' : '')
        },
        this.props.blockButtons.length > 0 ? _react2.default.createElement(_blocktoolbar2.default, {
          editorState: editorState,
          onToggle: this.props.toggleBlockType,
          buttons: this.props.blockButtons
        }) : null,
        this.props.inlineButtons.length > 0 ? _react2.default.createElement(_inlinetoolbar2.default, {
          editorState: editorState,
          onToggle: this.props.toggleInlineStyle,
          buttons: this.props.inlineButtons
        }) : null,
        hasHyperLink && _react2.default.createElement(
          'div',
          { className: 'md-RichEditor-controls' },
          _react2.default.createElement(
            'a',
            {
              className: 'md-RichEditor-styleButton md-RichEditor-linkButton hint--top',
              onClick: this.handleLinkInput,
              'aria-label': hyperlinkDescription
            },
            hyperlinkLabel
          )
        )
      );
    }
  }]);

  return Toolbar;
}(_react2.default.Component);

Toolbar.propTypes = {
  editorEnabled: _react.PropTypes.bool,
  editorState: _react.PropTypes.object,
  toggleBlockType: _react.PropTypes.func,
  toggleInlineStyle: _react.PropTypes.func,
  inlineButtons: _react.PropTypes.arrayOf(_react.PropTypes.object),
  blockButtons: _react.PropTypes.arrayOf(_react.PropTypes.object),
  editorNode: _react.PropTypes.object,
  setLink: _react.PropTypes.func,
  focus: _react.PropTypes.func
};
Toolbar.defaultProps = {
  blockButtons: BLOCK_BUTTONS,
  inlineButtons: INLINE_BUTTONS
};
exports.default = Toolbar;
var BLOCK_BUTTONS = exports.BLOCK_BUTTONS = [{
  label: 'H3',
  style: 'header-three',
  icon: 'header',
  description: 'Heading 3'
}, {
  label: 'Q',
  style: 'blockquote',
  icon: 'quote-right',
  description: 'Blockquote'
}, {
  label: 'UL',
  style: 'unordered-list-item',
  icon: 'list-ul',
  description: 'Unordered List'
}, {
  label: 'OL',
  style: 'ordered-list-item',
  icon: 'list-ol',
  description: 'Ordered List'
}, {
  label: '✓',
  style: 'todo',
  description: 'Todo List'
}];

var INLINE_BUTTONS = exports.INLINE_BUTTONS = [{
  label: 'B',
  style: 'BOLD',
  icon: 'bold',
  description: 'Bold'
}, {
  label: 'I',
  style: 'ITALIC',
  icon: 'italic',
  description: 'Italic'
}, {
  label: 'U',
  style: 'UNDERLINE',
  icon: 'underline',
  description: 'Underline'
}, {
  label: 'Hi',
  style: 'HIGHLIGHT',
  description: 'Highlight selection'
}, {
  label: '#',
  style: _constants.HYPERLINK,
  icon: 'link',
  description: 'Add a link'
}];
// {
//   label: 'S',
//   style: 'STRIKETHROUGH',
//   icon: 'strikethrough',
//   description: 'Strikethrough',
// },
// {
//   label: 'Code',
//   style: 'CODE',
//   description: 'Inline Code',
// },