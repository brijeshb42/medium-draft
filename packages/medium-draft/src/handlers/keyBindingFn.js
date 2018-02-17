import { getDefaultKeyBinding } from 'draft-js';


export const customKeyBindingFn = (e, { keyBindingFn: kbFn }) => kbFn(e);

export const handlerList = [customKeyBindingFn];


export default (e, options, handlers = handlerList) => {
  for (let i = 0; i < handlers.length; i += 1) {
    const handler = handlers[i];
    const res = handler(e, options);
    if (res) {
      return res;
    }
  }
  return getDefaultKeyBinding(e);
};
