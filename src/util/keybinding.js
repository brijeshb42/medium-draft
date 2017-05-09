import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

import { KEY_COMMANDS } from './constants';

const { changeType, showLinkInput, unlink } = KEY_COMMANDS;

/*
Emits various key commands to be used by `handleKeyCommand` in `Editor` based
on various key combos.
*/
export default (e) => {
  if (KeyBindingUtil.hasCommandModifier(e) && e.which === 75) {
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
        default: return getDefaultKeyBinding(e);
      }
    }
    switch (e.which) {
      // 1
      case 49: return changeType('ordered-list-item');
      // @
      case 50: return showLinkInput();
      // #
      case 51: return changeType('header-three');
      // *
      case 56: return changeType('unordered-list-item');
      // <
      case 188: return changeType('caption');
      // // -
      // case 189: return 'changetype:caption';
      // >
      case 190: return changeType('unstyled');
      // "
      case 222: return changeType('blockquote');
      default: return getDefaultKeyBinding(e);
    }
  }
  // if (e.keyCode === 46 && !e.ctrlKey) {
  //   return KEY_COMMANDS.deleteBlock();
  // }
  return getDefaultKeyBinding(e);
};
