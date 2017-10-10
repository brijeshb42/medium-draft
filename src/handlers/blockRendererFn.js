export const customRendererFn = (contentBlock, {
  rendererFn,
  getEditorState,
  setEditorState,
}) => {
  const customRenderer = rendererFn(setEditorState, getEditorState);
  return customRenderer(contentBlock);
};


export const handlerList = [customRendererFn];


const blockRendererFn = (contentBlock, options, handlers = handlerList) => {
  for (const handler of handlers) {
    const res = handler(contentBlock, options);
    if (res) {
      return res;
    }
  }
  return null;
};

export default blockRendererFn;
