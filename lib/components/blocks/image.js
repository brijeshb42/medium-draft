'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _model = require('../../model/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageBlock = function ImageBlock(props) {
  var block = props.block,
      blockProps = props.blockProps;
  var getEditorState = blockProps.getEditorState;

  var data = block.getData();
  var src = data.get('src');
  var currentBlock = (0, _model.getCurrentBlock)(getEditorState());
  var className = currentBlock.getKey() === block.getKey() ? 'md-image-is-selected' : '';
  if (src !== null) {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'md-block-image-inner-container' },
        _react2.default.createElement('img', { role: 'presentation', className: className, src: src })
      ),
      _react2.default.createElement(
        'figcaption',
        null,
        _react2.default.createElement(_draftJs.EditorBlock, props)
      )
    );
  }
  return _react2.default.createElement(_draftJs.EditorBlock, props);
};

ImageBlock.propTypes = {
  block: _react.PropTypes.object,
  blockProps: _react.PropTypes.object
};

exports.default = ImageBlock;