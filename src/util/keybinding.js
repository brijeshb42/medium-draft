import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;

export default (e) => {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'editor-save';
  }
  return getDefaultKeyBinding(e);
}
