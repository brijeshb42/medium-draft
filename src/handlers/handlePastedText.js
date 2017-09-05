import { Modifier, EditorState } from 'draft-js';

import { getCurrentBlock } from '../model';
import { Block, HANDLED, NOT_HANDLED } from '../util/constants';

/**
 * If current block is image and text is pasted, add that as plain
 * text at the cursor position.
 */
export const handlePasteInImageCaption = (text, html, es, { getEditorState }) => {
  const editorState = getEditorState();
  const currentBlock = getCurrentBlock(editorState);
  if (currentBlock.getType() !== Block.IMAGE) {
    return editorState;
  }

  return EditorState.push(
    editorState,
    Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text
    )
  );
};


export const handlerList = [handlePasteInImageCaption];


const handlePastedText = (text, html, es, options, handlers = handlerList) => {
  const originalEs = options.getEditorState();
  let editorState = originalEs;

  const _getEs = () => editorState;
  let behavior = NOT_HANDLED;

  for (const handler of handlers) {
    editorState = handler(text, html, es, {
      ...options,
      getEditorState: _getEs,
    });
    if (editorState !== originalEs) {
      options.setEditorState(editorState);
      behavior = HANDLED;
      break;
    }
  }
  return behavior;
};

export default handlePastedText;
