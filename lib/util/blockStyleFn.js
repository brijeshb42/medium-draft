'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

/*
Get custom classnames for each of the different block types supported.
*/

var BASE_BLOCK_CLASS = 'md-block';

exports.default = function (block) {
  switch (block.getType()) {
    case _constants.Block.BLOCKQUOTE:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-quote md-RichEditor-blockquote';
    case _constants.Block.UNSTYLED:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-paragraph';
    case _constants.Block.ATOMIC:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-atomic';
    case _constants.Block.CAPTION:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-caption';
    case _constants.Block.TODO:
      {
        var data = block.getData();
        var checkedClass = data.get('checked') === true ? BASE_BLOCK_CLASS + '-todo-checked' : BASE_BLOCK_CLASS + '-todo-unchecked';
        var finalClass = BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-paragraph ';
        finalClass += BASE_BLOCK_CLASS + '-todo ' + checkedClass;
        return finalClass;
      }
    case _constants.Block.IMAGE:
      return BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-image';
    case _constants.Block.BLOCKQUOTE_CAPTION:
      {
        var cls = BASE_BLOCK_CLASS + ' ' + BASE_BLOCK_CLASS + '-quote';
        return cls + ' md-RichEditor-blockquote ' + BASE_BLOCK_CLASS + '-quote-caption';
      }
    default:
      return BASE_BLOCK_CLASS;
  }
};