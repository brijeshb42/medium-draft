import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;


/*
Emits various key commands to be used by `handleKeyCommand` in `Editor` based
on various key combos.
*/
export default (e) => {
  if (e.altKey === true) {
    if (e.shiftKey === true) {
      switch (e.which) {
        // Alt + Shift + A
        case 65: return 'add-new-block';
        default: return getDefaultKeyBinding(e);
      }
    }
    switch(e.which) {
      // 1
      case 49: return 'changetype:ordered-list-item';
      // @
      case 50: return 'showlinkinput';
      // #
      case 51: return 'changetype:header-three';
      // *
      case 56: return 'changetype:unordered-list-item';
      
      //S
      // case 83: return 'editor-save';
      // = +
      // case 187: return 'add-new-block';
      // <
      case 188: return 'changetype:caption';
      // // -
      // case 189: return 'changetype:caption';
      // >
      case 190: return 'changetype:unstyled';
      // "
      case 222: return 'changetype:blockquote';      
    }
  }
  return getDefaultKeyBinding(e);
}
