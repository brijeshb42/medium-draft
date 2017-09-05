import { RichUtils } from 'draft-js';

const MAX_NESTING_LEVEL = 2;

const handleTabForListItems = (e, { getEditorState }) => {
  const editorState = getEditorState();
  const newEditorState = RichUtils.onTab(e, editorState, MAX_NESTING_LEVEL);
  if (newEditorState === editorState) {
    return editorState;
  }
  return newEditorState;
};

const onTabHandlers = [handleTabForListItems];

const onTab = (e, options, handlers = onTabHandlers) => {
  const { getEditorState, setEditorState } = options;
  const newEditorState = handlers.reduce((editorState, handler) => (
    handler(e, {
      getEditorState: () => editorState,
    })
  ), getEditorState());
  setEditorState(newEditorState);
};

export default onTab;
