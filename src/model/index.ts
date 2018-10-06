import * as Draft from 'draft-js';
import { Block } from '../util/constants';

export function createEditorState(content: string | Draft.RawDraftContentState = null): Draft.EditorState {
  if (content === null) {
    return Draft.EditorState.createEmpty();
  }

  let contentState: Draft.ContentState;

  if (typeof content === 'string') {
    contentState = Draft.ContentState.createFromText(content);
  } else {
    contentState = Draft.convertFromRaw(content);
  }

  return Draft.EditorState.createWithContent(contentState);
}

/**
 * Get block level metadata for a given block type.
 * @param blockType 
 * @param initialData 
 */
export function getDefaultBlockData(blockType: string, initialData: Object = {}): Object {
  switch (blockType) {
    case Block.TODO:
      return {
        checked: false,
      };
    default:
      return initialData;
  }
}

/**
 * Get current data of block which has the cursor.
 * @param editorState 
 */
export function getCurrentBlock(editorState: Draft.EditorState): Draft.ContentBlock {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  return contentState.getBlockForKey(selectionState.getStartKey());
}

/**
 * Replace an empty block at the current cursor position with a
 * new block of the given type
 * @param editorState 
 * @param newType 
 * @param initialData 
 */
export function addNewBlock(editorState: Draft.EditorState, newType: string = Block.UNSTYLED, initialData: Object = {}): Draft.EditorState {
  const selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return editorState;
  }
  if (currentBlock.getLength() === 0) {
    if (currentBlock.getType() === newType) {
      return editorState;
    }
    const newBlock = <Draft.ContentBlock>currentBlock.merge({
      type: newType,
      data: getDefaultBlockData(newType, initialData),
    });
    const newContentState = <Draft.ContentState>contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState,
    });
    return Draft.EditorState.push(editorState, newContentState, 'change-block-type');
  }
  return editorState;
}

/**
 * Changes the block type of the current block. Merge current data
 * with the new overrides.
 * @param editorState 
 * @param newType 
 * @param overrides 
 */
export const resetBlockWithType = (editorState: Draft.EditorState, newType: string = Block.UNSTYLED, overrides: Object = {}) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  const newBlock = <Draft.ContentBlock>block.mergeDeep(overrides, {
    type: newType,
    data: getDefaultBlockData(newType),
  });
  const newContentState = <Draft.ContentState>contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });
  return Draft.EditorState.push(editorState, newContentState, 'change-block-type');
};

/**
 * Update block-level metadata of the given `block` to the `newData`
 * @param editorState 
 * @param block 
 * @param newData 
 */
export const updateDataOfBlock = (editorState: Draft.EditorState, block: Draft.ContentBlock, newData: Object) => {
  const contentState = editorState.getCurrentContent();
  const newBlock = <Draft.ContentBlock>block.merge({
    data: newData,
  });
  const newContentState = <Draft.ContentState>contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
  });
  return Draft.EditorState.push(editorState, newContentState, 'change-block-data');
};
