'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './atomic.scss';

var AtomicBlock = function AtomicBlock(props) {
  var entity = _draftJs.Entity.get(props.block.getEntityAt(0));
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

AtomicBlock.propTypes = {
  block: _react.PropTypes.object
};

exports.default = AtomicBlock;