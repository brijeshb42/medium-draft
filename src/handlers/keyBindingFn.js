import { getDefaultKeyBinding } from 'draft-js';


export const customKeyBindingFn = (e, { keyBindingFn: kbFn }) => kbFn(e);

export const handlerList = [customKeyBindingFn];


export default (e, options, handlers = handlerList) => {
  for (const handler of handlers) {
    const res = handler(e, options);
    if (res) {
      return res;
    }
  }
  return getDefaultKeyBinding(e);
};
