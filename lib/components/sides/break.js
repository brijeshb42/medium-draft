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

var BreakButton = function (_React$Component) {
  _inherits(BreakButton, _React$Component);

  function BreakButton(props) {
    _classCallCheck(this, BreakButton);

    var _this = _possibleConstructorReturn(this, (BreakButton.__proto__ || Object.getPrototypeOf(BreakButton)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    return _this;
  }

  _createClass(BreakButton, [{
    key: 'onClick',
    value: function onClick() {
      this.props.setEditorState((0, _model.addNewBlock)(this.props.getEditorState(), _constants.Block.BREAK));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'button',
        { className: 'md-sb-button', onClick: this.onClick, type: 'button' },
        _react2.default.createElement('i', { className: 'fa fa-minus' })
      );
    }
  }]);

  return BreakButton;
}(_react2.default.Component);

exports.default = BreakButton;


BreakButton.propTypes = {
  setEditorState: _propTypes2.default.func,
  getEditorState: _propTypes2.default.func,
  close: _propTypes2.default.func
};