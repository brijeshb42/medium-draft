'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _model = require('../../model');

var _constants = require('../../util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageButton = function (_React$Component) {
  _inherits(ImageButton, _React$Component);

  function ImageButton(props) {
    _classCallCheck(this, ImageButton);

    var _this = _possibleConstructorReturn(this, (ImageButton.__proto__ || Object.getPrototypeOf(ImageButton)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onChange = _this.onChange.bind(_this);
    return _this;
  }

  _createClass(ImageButton, [{
    key: 'onClick',
    value: function onClick() {
      this.input.value = null;
      this.input.click();
    }

    /*
    This is an example of how an image button can be added
    on the side control. This Button handles the image addition locally
    by creating an object url. You can override this method to upload
    images to your server first, then get the image url in return and then
    add to the editor.
    */

  }, {
    key: 'onChange',
    value: function onChange(e) {
      // e.preventDefault();
      var file = e.target.files[0];
      if (file.type.indexOf('image/') === 0) {
        // console.log(this.props.getEditorState());
        // eslint-disable-next-line no-undef
        var src = URL.createObjectURL(file);
        this.props.setEditorState((0, _model.addNewBlock)(this.props.getEditorState(), _constants.Block.IMAGE, {
          src: src
        }));
      }
      this.props.close();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'button',
        {
          className: 'md-sb-button md-sb-img-button',
          type: 'button',
          onClick: this.onClick,
          title: 'Add an Image'
        },
        _react2.default.createElement('i', { className: 'fa fa-image' }),
        _react2.default.createElement('input', {
          type: 'file',
          accept: 'image/*',
          ref: function ref(c) {
            _this2.input = c;
          },
          onChange: this.onChange,
          style: { display: 'none' }
        })
      );
    }
  }]);

  return ImageButton;
}(_react2.default.Component);

ImageButton.propTypes = {
  setEditorState: _propTypes2.default.func,
  getEditorState: _propTypes2.default.func,
  close: _propTypes2.default.func
};
exports.default = ImageButton;