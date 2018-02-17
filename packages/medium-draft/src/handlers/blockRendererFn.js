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
  for (let i = 0; i < handlers.length; i += 1) {
    const handler = handlers[i];
    const res = handler(contentBlock, options);
    if (res) {
      return res;
    }
  }
  return null;
};

export default blockRendererFn;
