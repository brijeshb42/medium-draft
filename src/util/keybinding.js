import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;

export default (e) => {
  if (hasCommandModifier(e)) {
    switch(e.keyCode) {
      //S
      case 83: return 'editor-save';
      // "
      case 222: return 'changetype:blockquote';
      // -
      case 189: return 'changetype:caption';
      // =
      case 187: return 'changetype:unstyled';
      // #
      case 51: return 'changetype:header-three';
      // *
      case 56: return 'changetype:unordered-list-item';
      // 1
      case 49: return 'changetype:ordered-list-item';
      default: return getDefaultKeyBinding(e);
    }
  }
  return getDefaultKeyBinding(e);
}
