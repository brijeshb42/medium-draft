'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setImportOptions = exports.options = exports.htmlToBlock = exports.htmlToEntity = exports.htmlToStyle = undefined;

var _draftConvert = require('draft-convert');

var _constants = require('./util/constants');

var htmlToStyle = exports.htmlToStyle = function htmlToStyle(nodeName, node, currentStyle) {
  switch (nodeName) {
    case 'em':
      return currentStyle.add(_constants.Inline.ITALIC);
    case 'strong':
      return currentStyle.add(_constants.Inline.BOLD);
    case 'strike':
      return currentStyle.add(_constants.Inline.STRIKETHROUGH);
    case 'u':
      return currentStyle.add(_constants.Inline.UNDERLINE);
    case 'span':
      if (node.className === 'md-inline-' + _constants.Inline.HIGHLIGHT.toLowerCase()) {
        return currentStyle.add(_constants.Inline.HIGHLIGHT);
      }
      break;
    case 'code':
      return currentStyle.add(_constants.Inline.CODE);
    default:
      break;
  }

  return currentStyle;
};

var htmlToEntity = exports.htmlToEntity = function htmlToEntity(nodeName, node, createEntity) {
  if (nodeName === 'a') {
    return createEntity(_constants.Entity.LINK, 'MUTABLE', { url: node.href });
  }
  return undefined;
};

var htmlToBlock = exports.htmlToBlock = function htmlToBlock(nodeName, node) {
  if (nodeName === 'h1') {
    return {
      type: _constants.Block.H1,
      data: {}
    };
  } else if (nodeName === 'h2') {
    return {
      type: _constants.Block.H2,
      data: {}
    };
  } else if (nodeName === 'h3') {
    return {
      type: _constants.Block.H3,
      data: {}
    };
  } else if (nodeName === 'h4') {
    return {
      type: _constants.Block.H4,
      data: {}
    };
  } else if (nodeName === 'h5') {
    return {
      type: _constants.Block.H5,
      data: {}
    };
  } else if (nodeName === 'h6') {
    return {
      type: _constants.Block.H6,
      data: {}
    };
  } else if (nodeName === 'p' && (node.className === 'md-block-' + _constants.Block.CAPTION.toLowerCase() || node.className === 'md-block-' + _constants.Block.BLOCKQUOTE_CAPTION.toLowerCase())) {
    return {
      type: _constants.Block.BLOCKQUOTE_CAPTION,
      data: {}
    };
  } else if (nodeName === 'figure') {
    if (node.className.match(/^md-block-image/)) {
      var imageNode = node.querySelector('img');
      return {
        type: _constants.Block.IMAGE,
        data: {
          src: imageNode && imageNode.src
        }
      };
    } else if (node.className === 'md-block-' + _constants.Block.ATOMIC.toLowerCase()) {
      return {
        type: _constants.Block.ATOMIC,
        data: {}
      };
    }
    return undefined;
  } else if (nodeName === 'div' && node.className && node.className.match(/^md-block-todo/)) {
    var inputNode = node.querySelector('input');
    return {
      type: _constants.Block.TODO,
      data: {
        checked: inputNode && inputNode.checked
      }
    };
  } else if (nodeName === 'hr') {
    return {
      type: _constants.Block.BREAK,
      data: {}
    };
  } else if (nodeName === 'blockquote') {
    return {
      type: _constants.Block.BLOCKQUOTE,
      data: {}
    };
  } else if (nodeName === 'p') {
    return {
      type: _constants.Block.UNSTYLED,
      data: {}
    };
  }

  return undefined;
};

var options = exports.options = {
  htmlToStyle: htmlToStyle,
  htmlToEntity: htmlToEntity,
  htmlToBlock: htmlToBlock
};

var setImportOptions = exports.setImportOptions = function setImportOptions() {
  var htmlOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options;
  return (0, _draftConvert.convertFromHTML)(htmlOptions);
};

exports.default = function (rawHTML) {
  var htmlOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options;
  return (0, _draftConvert.convertFromHTML)(htmlOptions)(rawHTML);
};