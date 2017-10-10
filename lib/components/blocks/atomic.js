'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AtomicBlock = function AtomicBlock(props) {
  var content = props.getEditorState().getCurrentContent();
  var entity = content.getEntity(props.block.getEntityAt(0));
  var data = entity.getData();
  var type = entity.getType();
  if (type === 'image') {
    return _react2.default.createElement(
      'div',
      { className: 'md-block-atomic-wrapper' },
      _react2.default.createElement('img', { role: 'presentation', src: data.src }),
      _react2.default.createElement(
        'div',
        { className: 'md-block-atomic-controls' },
        _react2.default.createElement(
          'button',
          null,
          '\xD7'
        )
      )
    );
  }
  return _react2.default.createElement(
    'p',
    null,
    'No supported block for ',
    type
  );
};
// import './atomic.scss';

AtomicBlock.propTypes = {
  block: _propTypes2.default.object,
  getEditorState: _propTypes2.default.func
};

exports.default = AtomicBlock;