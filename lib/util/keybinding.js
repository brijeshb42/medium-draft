'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _constants = require('./constants');

var changeType = _constants.KEY_COMMANDS.changeType,
    showLinkInput = _constants.KEY_COMMANDS.showLinkInput,
    unlink = _constants.KEY_COMMANDS.unlink;

/*
Emits various key commands to be used by `handleKeyCommand` in `Editor` based
on various key combos.
*/

exports.default = function (e) {
  if (_draftJs.KeyBindingUtil.hasCommandModifier(e) && e.which === 75) {
    if (e.shiftKey) {
      return unlink();
    }
    return showLinkInput();
  }
  if (e.altKey === true && !e.ctrlKey) {
    if (e.shiftKey === true) {
      switch (e.which) {
        // Alt + Shift + A
        // case 65: return addNewBlock();
        default:
          return (0, _draftJs.getDefaultKeyBinding)(e);
      }
    }
    switch (e.which) {
      // 1
      case 49:
        return changeType('ordered-list-item');
      // @
      case 50:
        return showLinkInput();
      // #
      case 51:
        return changeType('header-three');
      // *
      case 56:
        return changeType('unordered-list-item');
      // <
      case 188:
        return changeType('caption');
      // // -
      // case 189: return 'changetype:caption';
      // >
      case 190:
        return changeType('unstyled');
      // "
      case 222:
        return changeType('blockquote');
      default:
        return (0, _draftJs.getDefaultKeyBinding)(e);
    }
  }
  // if (e.keyCode === 46 && !e.ctrlKey) {
  //   return KEY_COMMANDS.deleteBlock();
  // }
  return (0, _draftJs.getDefaultKeyBinding)(e);
};