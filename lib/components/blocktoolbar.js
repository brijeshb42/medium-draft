'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _stylebutton = require('./stylebutton');

var _stylebutton2 = _interopRequireDefault(_stylebutton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockToolbar = function BlockToolbar(props) {
  if (props.buttons.length < 1) {
    return null;
  }
  var editorState = props.editorState;

  var blockType = _draftJs.RichUtils.getCurrentBlockType(editorState);
  return _react2.default.createElement(
    'div',
    { className: 'md-RichEditor-controls md-RichEditor-controls-block' },
    props.buttons.map(function (type) {
      var iconLabel = {};
      iconLabel.label = type.label;
      return _react2.default.createElement(_stylebutton2.default, _extends({}, iconLabel, {
        key: type.style,
        active: type.style === blockType,
        onToggle: props.onToggle,
        style: type.style,
        description: type.description
      }));
    })
  );
};

BlockToolbar.propTypes = {
  buttons: _propTypes2.default.array,
  editorState: _propTypes2.default.object.isRequired,
  onToggle: _propTypes2.default.func
};

exports.default = BlockToolbar;