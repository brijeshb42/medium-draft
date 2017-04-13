'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Map;

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
Mapping that returns containers for the various block types.
*/
var RenderMap = (0, _immutable.Map)((_Map = {}, _defineProperty(_Map, _constants.Block.CAPTION, {
  element: 'cite'
}), _defineProperty(_Map, _constants.Block.BLOCKQUOTE_CAPTION, {
  element: 'blockquote'
}), _defineProperty(_Map, _constants.Block.TODO, {
  element: 'div'
}), _defineProperty(_Map, _constants.Block.IMAGE, {
  element: 'figure'
}), _defineProperty(_Map, _constants.Block.BREAK, {
  element: 'div'
}), _Map)).merge(_draftJs.DefaultDraftBlockRenderMap);

exports.default = RenderMap;