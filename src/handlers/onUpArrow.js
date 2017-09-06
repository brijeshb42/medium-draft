import { ContentBlock, genKey, EditorState } from 'draft-js';
import { OrderedMap } from 'immutable';

import { getCurrentBlock } from '../model';
import { Block } from '../util/constants';


/**
 * If current block is atomic/image and it is also the first block,
 * and then UP arrow is pressed, insert an empty UNSTYLED block
 * above and focus to it.
 */
export const handleUpArrowFromFirstAtomicBlock = (e, { getEditorState }) => {
  const editorState = getEditorState();
  const currentBlock = getCurrentBlock(editorState);
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const firstBlock = content.getFirstBlock();

  if (firstBlock.getKey() !== currentBlock.getKey() ||
      firstBlock.getType().indexOf(Block.ATOMIC) !== 0) {
    return editorState;
  }
  // If cursor's block is the first block and it is of type atomic,
  // add a new empty block before it and add focus to it.
  e.preventDefault();
  const newBlock = new ContentBlock({
    type: Block.UNSTYLED,
    key: genKey(),
  });
  const newBlockMap = OrderedMap([
    [newBlock.getKey(), newBlock],
  ]).concat(content.getBlockMap());

  const newContent = content.merge({
    blockMap: newBlockMap,
    selectionAfter: selection.merge({
      anchorKey: newBlock.getKey(),
      focusKey: newBlock.getKey(),
      anchorOffset: 0,
      focusOffset: 0,
      isBackward: false,
    }),
  });
  return EditorState.push(
    editorState,
    newContent,
    'insert-characters'
  );
};


/**
 * If current block is atomic and up arrow is pressed,
 * move the cursor to previous block.
 */
export const handleUpArrowAroundAtomicBlock = (e, { getEditorState }) => {
  const editorState = getEditorState();
  const currentBlock = getCurrentBlock(editorState);

  if (currentBlock.getType().indexOf(Block.ATOMIC) !== 0) {
    return editorState;
  }

  const content = editorState.getCurrentContent();
  const blockBefore = content.getBlockBefore(currentBlock.getKey());
  const selection = editorState.getSelection();

  if (!blockBefore) {
    return editorState;
  }
  e.preventDefault();
  const newSelection = selection.merge({
    anchorKey: blockBefore.getKey(),
    focusKey: blockBefore.getKey(),
    anchorOffset: blockBefore.getLength(),
    focusOffset: blockBefore.getLength(),
    isBackward: false,
  });
  return EditorState.forceSelection(editorState, newSelection);
};


export const handlerList = [
  handleUpArrowFromFirstAtomicBlock,
  handleUpArrowAroundAtomicBlock,
];


const onUpArrow = (e, options, handlers = handlerList) => {
  const { getEditorState, setEditorState } = options;
  const newEditorState = handlers.reduce((editorState, handler) => (
    handler(e, {
      ...options,
      getEditorState: () => editorState,
    })
  ), getEditorState());
  setEditorState(newEditorState);
};

export default onUpArrow;
