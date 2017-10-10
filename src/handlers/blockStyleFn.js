export const inBuiltBlockStyleFn = (block, { blockStyleFn: bsFn }) => bsFn(block);

export const handlerList = [inBuiltBlockStyleFn];

const blockStyleFn = (block, options, handlers = handlerList) => {
  for (const handler of handlers) {
    const res = handler(block, options);
    if (res) {
      return res;
    }
  }
  return 'md-block';
};

export default blockStyleFn;
