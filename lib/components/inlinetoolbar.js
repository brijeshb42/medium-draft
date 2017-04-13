'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylebutton = require('./stylebutton');

var _stylebutton2 = _interopRequireDefault(_stylebutton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineToolbar = function InlineToolbar(props) {
  if (props.buttons.length < 1) {
    return null;
  }
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return _react2.default.createElement(
    'div',
    { className: 'md-RichEditor-controls' },
    props.buttons.map(function (type) {
      var iconLabel = {};
      iconLabel.label = type.label;
      // if (type.icon) {
      //   iconLabel.icon = type.icon;
      // } else {
      //   iconLabel.label = type.label;
      // }
      return _react2.default.createElement(_stylebutton2.default, _extends({}, iconLabel, {
        key: type.style,
        active: currentStyle.has(type.style),
        onToggle: props.onToggle,
        style: type.style,
        description: type.description
      }));
    })
  );
};

InlineToolbar.propTypes = {
  buttons: _react.PropTypes.array,
  editorState: _react.PropTypes.object.isRequired,
  onToggle: _react.PropTypes.func
};

exports.default = InlineToolbar;