'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _model = require('../../model/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageBlock = function (_React$Component) {
  _inherits(ImageBlock, _React$Component);

  function ImageBlock() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ImageBlock);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ImageBlock.__proto__ || Object.getPrototypeOf(ImageBlock)).call.apply(_ref, [this].concat(args))), _this), _this.focusBlock = function () {
      var _this$props = _this.props,
          block = _this$props.block,
          blockProps = _this$props.blockProps;
      var getEditorState = blockProps.getEditorState,
          setEditorState = blockProps.setEditorState;

      var key = block.getKey();
      var editorState = getEditorState();
      var currentblock = (0, _model.getCurrentBlock)(editorState);
      if (currentblock.getKey() === key) {
        return;
      }
      var newSelection = new _draftJs.SelectionState({
        anchorKey: key,
        focusKey: key,
        anchorOffset: 0,
        focusOffset: 0
      });
      setEditorState(_draftJs.EditorState.forceSelection(editorState, newSelection));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ImageBlock, [{
    key: 'render',
    value: function render() {
      var block = this.props.block;

      var data = block.getData();
      var src = data.get('src');
      if (src !== null) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'md-block-image-inner-container', onClick: this.focusBlock },
            _react2.default.createElement('img', { role: 'presentation', src: src })
          ),
          _react2.default.createElement(
            'figcaption',
            null,
            _react2.default.createElement(_draftJs.EditorBlock, this.props)
          )
        );
      }
      return _react2.default.createElement(_draftJs.EditorBlock, this.props);
    }
  }]);

  return ImageBlock;
}(_react2.default.Component);

ImageBlock.propTypes = {
  block: _propTypes2.default.object,
  blockProps: _propTypes2.default.object
};
exports.default = ImageBlock;