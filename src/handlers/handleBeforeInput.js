/**
 * This function is responsible for emitting various commands based on various key combos.
 */

import { HANDLED, NOT_HANDLED } from '../util/constants';

export const handlerUsingBeforeInput = (str, {
  getEditorState,
  beforeInput,
  stringToTypeMap,
}) => {
  let editorState = getEditorState();
  const onChange = (es) => {
    editorState = es;
  };
  const behavior = beforeInput(editorState, str, onChange, stringToTypeMap);
  if (behavior === HANDLED) {
    return editorState;
  }
  return getEditorState();
};


export const handlerList = [handlerUsingBeforeInput];

const handleBeforeInput = (str, options, handlers = handlerList) => {
  const originalEs = options.getEditorState();
  let editorState = originalEs;

  const _getEs = () => editorState;
  let behavior = NOT_HANDLED;

  for (const handler of handlers) {
    editorState = handler(str, {
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

export default handleBeforeInput;
