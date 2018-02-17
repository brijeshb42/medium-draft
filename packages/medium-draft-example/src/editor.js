import { createEditor, getCurrentBlock } from 'medium-draft';

const Editor = createEditor({
  onUpArrow(e, { getEditorState }) {
    const block = getCurrentBlock(getEditorState());
    console.log(block.toJS());
  },
});

export default Editor;
