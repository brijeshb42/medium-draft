'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringToTypeMap = undefined;

var _model = require('../model');

var _constants = require('./constants');

/*
This is a key value pair where the key is the string that is input while typing.
While typing in an empty block, if the entered text matches any of the keys in
this dictionary, that particular block's type will be changed to the value
associated with that key.
*/
var StringToTypeMap = exports.StringToTypeMap = {
  '--': _constants.Block.BLOCKQUOTE + ':' + _constants.Block.BLOCKQUOTE_CAPTION + ':' + _constants.Block.CAPTION,
  '> ': _constants.Block.BLOCKQUOTE,
  '*.': _constants.Block.UL,
  '* ': _constants.Block.UL,
  '- ': _constants.Block.UL,
  '1.': _constants.Block.OL,
  '# ': _constants.Block.H1,
  '##': _constants.Block.H2,
  '==': _constants.Block.UNSTYLED,
  '[]': _constants.Block.TODO
};

/*
This function is called before text is input in a block in `draft-js`. It checks
whether the input string (first 2 cahracters only) is present in the `StringToTypeMap`
mapping or not. If present, it converts the current block's type and called the `editor`'s
`onChange` function. Otherwise, does nothing. By defualt, the above key-value mapping
is passed. In custom implementation, users can pass their own mapping or extend
the current one.
*/
var beforeInput = function beforeInput(editorState, inputString, onChange) {
  var mapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : StringToTypeMap;

  var selection = editorState.getSelection();
  var block = (0, _model.getCurrentBlock)(editorState);
  var blockType = block.getType();
  if (blockType.indexOf(_constants.Block.ATOMIC) === 0) {
    return _constants.NOT_HANDLED;
  }
  var blockLength = block.getLength();
  if (selection.getAnchorOffset() > 1 || blockLength > 1) {
    return _constants.NOT_HANDLED;
  }
  var blockTo = mapping[block.getText()[0] + inputString];
  if (!blockTo) {
    return _constants.NOT_HANDLED;
  }
  var finalType = blockTo.split(':');
  if (finalType.length < 1 || finalType.length > 3) {
    return _constants.NOT_HANDLED;
  }
  var fType = finalType[0];
  if (finalType.length === 1) {
    if (blockType === finalType[0]) {
      return _constants.NOT_HANDLED;
    }
  } else if (finalType.length === 2) {
    if (blockType === finalType[1]) {
      return _constants.NOT_HANDLED;
    }
    if (blockType === finalType[0]) {
      fType = finalType[1];
    }
  } else if (finalType.length === 3) {
    if (blockType === finalType[2]) {
      return _constants.NOT_HANDLED;
    }
    if (blockType === finalType[0]) {
      fType = finalType[1];
    } else {
      fType = finalType[2];
    }
  }
  onChange((0, _model.resetBlockWithType)(editorState, fType, {
    text: ''
  }));
  return _constants.HANDLED;
};

exports.default = beforeInput;