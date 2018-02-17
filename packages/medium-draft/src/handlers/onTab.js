import { RichUtils } from 'draft-js';

const MAX_NESTING_LEVEL = 2;


export const handleTabForListItems = (e, { getEditorState }) => {
  const editorState = getEditorState();
  const newEditorState = RichUtils.onTab(e, editorState, MAX_NESTING_LEVEL);
  if (newEditorState === editorState) {
    return editorState;
  }
  return newEditorState;
};


export const handlerList = [handleTabForListItems];


const onTab = (e, options, handlers = handlerList) => {
  const { getEditorState, setEditorState } = options;
  const newEditorState = handlers.reduce((editorState, handler) => (
    handler(e, {
      ...options,
      getEditorState: () => editorState,
    })
  ), getEditorState());
  setEditorState(newEditorState);
};

export default onTab;
