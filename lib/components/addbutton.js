'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import './addbutton.scss';

/*
Implementation of the medium-link side `+` button to insert various rich blocks
like Images/Embeds/Videos.
*/
var AddButton = function (_React$Component) {
  _inherits(AddButton, _React$Component);

  function AddButton(props) {
    _classCallCheck(this, AddButton);

    var _this = _possibleConstructorReturn(this, (AddButton.__proto__ || Object.getPrototypeOf(AddButton)).call(this, props));

    _this.state = {
      style: {},
      visible: false,
      isOpen: false
    };
    _this.node = null;
    _this.blockKey = '';
    _this.blockType = '';
    _this.blockLength = -1;

    _this.findNode = _this.findNode.bind(_this);
    _this.hideBlock = _this.hideBlock.bind(_this);
    _this.openToolbar = _this.openToolbar.bind(_this);
    return _this;
  }

  // To show + button only when text length == 0


  _createClass(AddButton, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var editorState = newProps.editorState;

      var contentState = editorState.getCurrentContent();
      var selectionState = editorState.getSelection();
      if (!selectionState.isCollapsed() || selectionState.anchorKey !== selectionState.focusKey) {
        // console.log('no sel');
        this.hideBlock();
        return;
      }
      var block = contentState.getBlockForKey(selectionState.anchorKey);
      var bkey = block.getKey();
      if (block.getLength() > 0) {
        this.hideBlock();
        return;
      }
      if (block.getType() !== this.blockType) {
        this.blockType = block.getType();
        if (block.getLength() === 0) {
          setTimeout(this.findNode, 0);
        }
        return;
      }
      if (this.blockKey === bkey) {
        // console.log('block exists');
        if (block.getLength() > 0) {
          this.hideBlock();
        } else {
          this.setState({
            visible: true
          });
        }
        return;
      }
      this.blockKey = bkey;
      if (block.getLength() > 0) {
        // console.log('no len');
        this.hideBlock();
        return;
      }
      setTimeout(this.findNode, 0);
    }

    // Show + button regardless of block length
    // componentWillReceiveProps(newProps) {
    //   const { editorState } = newProps;
    //   const contentState = editorState.getCurrentContent();
    //   const selectionState = editorState.getSelection();
    //   if (!selectionState.isCollapsed() || selectionState.anchorKey != selectionState.focusKey) {
    //     this.hideBlock();
    //     return;
    //   }
    //   const block = contentState.getBlockForKey(selectionState.anchorKey);
    //   const bkey = block.getKey();
    //   if (block.getType() !== this.blockType) {
    //     this.blockType = block.getType();
    //     setTimeout(this.findNode, 0);
    //     return;
    //   }
    //   if (this.blockKey === bkey) {
    //     this.setState({
    //       visible: true
    //     });
    //     return;
    //   }
    //   this.blockKey = bkey;
    //   setTimeout(this.findNode, 0);
    // }

  }, {
    key: 'hideBlock',
    value: function hideBlock() {
      if (this.state.visible) {
        this.setState({
          visible: false,
          isOpen: false
        });
      }
    }
  }, {
    key: 'openToolbar',
    value: function openToolbar() {
      this.setState({
        isOpen: !this.state.isOpen
      }, this.props.focus);
    }
  }, {
    key: 'findNode',
    value: function findNode() {
      // eslint-disable-next-line no-undef
      var node = (0, _util.getSelectedBlockNode)(window);
      if (node === this.node) {
        // console.log('Node exists');
        return;
      }
      if (!node) {
        // console.log('no node');
        this.setState({
          visible: false,
          isOpen: false
        });
        return;
      }
      // const rect = node.getBoundingClientRect();
      this.node = node;
      this.setState({
        visible: true,
        style: {
          top: node.offsetTop - 3
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.state.visible) {
        return _react2.default.createElement(
          'div',
          { className: 'md-side-toolbar', style: this.state.style },
          _react2.default.createElement(
            'button',
            {
              onClick: this.openToolbar,
              className: 'md-sb-button md-add-button' + (this.state.isOpen ? ' md-open-button' : ''),
              type: 'button'
            },
            _react2.default.createElement('i', { className: 'fa fa-plus-circle fa-lg' })
          ),
          this.state.isOpen ? _react2.default.createElement(
            _reactAddonsCssTransitionGroup2.default,
            {
              transitionName: 'md-example',
              transitionEnterTimeout: 200,
              transitionLeaveTimeout: 100,
              transitionAppear: true,
              transitionAppearTimeout: 100
            },
            this.props.sideButtons.map(function (button) {
              var Button = button.component;
              return _react2.default.createElement(Button, {
                key: button.title,
                getEditorState: _this2.props.getEditorState,
                setEditorState: _this2.props.setEditorState,
                close: _this2.openToolbar
              });
            })
          ) : null
        );
      }
      return null;
    }
  }]);

  return AddButton;
}(_react2.default.Component);

exports.default = AddButton;


AddButton.propTypes = {
  focus: _react.PropTypes.func,
  getEditorState: _react.PropTypes.func.isRequired,
  setEditorState: _react.PropTypes.func.isRequired,
  sideButtons: _react.PropTypes.arrayOf(_react.PropTypes.object)
};