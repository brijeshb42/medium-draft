export const inBuiltBlockStyleFn = (block, { blockStyleFn: bsFn }) => bsFn(block);

export const handlerList = [inBuiltBlockStyleFn];

const blockStyleFn = (block, options, handlers = handlerList) => {
  for (let i = 0; i < handlers.length; i += 1) {
    const handler = handlers[i];
    const res = handler(block, options);
    if (res) {
      return res;
    }
  }
  return 'md-block';
};

export default blockStyleFn;
