import { EditorState } from 'draft-js';
import { DraftPlugin } from 'draft-js-plugins-editor';
import { swapBlocks } from '../model';

type KeyBoardFilterFunc = (ev: React.KeyboardEvent<{}> | KeyboardEvent) => boolean;

function defaultFilterFunction(ev: React.KeyboardEvent<{}>): boolean {
  return (ev.ctrlKey && ev.altKey);
}

enum MoveDirection {
  UP,
  DOWN,
};

function moveBlock(keyFilterFunction: KeyBoardFilterFunc, ev: React.KeyboardEvent<{}>, editorState: EditorState, direction: MoveDirection, setEditorState: (es: Draft.EditorState) => void): boolean {
  if (!keyFilterFunction(ev)) {
    return false;
  }
  const selection = editorState.getSelection();

  if (!selection.isCollapsed()) {
    return false;
  }

  const contentState = editorState.getCurrentContent();
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();
  const blockToMove = contentState.getBlockForKey(selection.getAnchorKey());
  
  const isUp = (direction === MoveDirection.UP);
  const isDown = (direction === MoveDirection.DOWN);

  console.log(isUp);
  if (
    (isUp && blockToMove.getKey() === firstBlock.getKey()) ||
    (isDown && blockToMove.getKey() === lastBlock.getKey())
   ) {
    return false;
  }

  const blockToSwapWith = isUp ? contentState.getBlockBefore(blockToMove.getKey()) : contentState.getBlockAfter(blockToMove.getKey());
  setEditorState(swapBlocks(editorState, blockToMove, blockToSwapWith));
  return true;
}


export default function blockMovePlugin(options?: {
  keyFilterFunction?: KeyBoardFilterFunc
}): DraftPlugin {
  const keyFilterFunction = (options && options.keyFilterFunction) || defaultFilterFunction;

  return {
    onUpArrow(ev, { getEditorState, setEditorState }) {
      return moveBlock(keyFilterFunction, ev, getEditorState(), MoveDirection.UP, setEditorState);
    },
    onDownArrow(ev, { getEditorState, setEditorState }) {
      return moveBlock(keyFilterFunction, ev, getEditorState(), MoveDirection.DOWN, setEditorState);
    },
  };
}
