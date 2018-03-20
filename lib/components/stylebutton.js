'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../util/constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyleButton = function (_React$Component) {
  _inherits(StyleButton, _React$Component);

  function StyleButton(props) {
    _classCallCheck(this, StyleButton);

    var _this = _possibleConstructorReturn(this, (StyleButton.__proto__ || Object.getPrototypeOf(StyleButton)).call(this, props));

    _this.onToggle = function (e) {
      e.preventDefault();
      _this.props.onToggle(_this.props.style);
    };
    return _this;
  }

  _createClass(StyleButton, [{
    key: 'render',
    value: function render() {
      if (this.props.style === _constants.HYPERLINK) {
        return null;
      }
      var className = 'md-RichEditor-styleButton';
      if (this.props.active) {
        className += ' md-RichEditor-activeButton';
      }
      className += ' md-RichEditor-styleButton-' + this.props.style.toLowerCase();
      return _react2.default.createElement(
        'span',
        {
          className: className + ' hint--top',
          onMouseDown: this.onToggle,
          'aria-label': this.props.description
        },
        this.props.icon ? _react2.default.createElement('i', { className: 'fa fa-' + this.props.icon }) : this.props.label
      );
    }
  }]);

  return StyleButton;
}(_react2.default.Component);

exports.default = StyleButton;


StyleButton.propTypes = {
  onToggle: _propTypes2.default.func,
  style: _propTypes2.default.string,
  active: _propTypes2.default.bool,
  icon: _propTypes2.default.string,
  label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element, _propTypes2.default.object]),
  description: _propTypes2.default.string
};