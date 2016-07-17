import { RichUtils, EditorState, ContentBlock, Modifier } from 'draft-js'

import { Block } from 'util/constants';

export const getDefaultBlockData = (blockType, initialData={}) => {
  switch(blockType) {
    case Block.TODO: return { checked: false };
    default: return initialData;
  }
};


export const getCurrentBlock = (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  return block;
};

export const addNewBlock = (newType=Block.UNSTYLED) => {
  const selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    console.log('selection not collapsed');
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    console.log('no current block');
    return editorState;
  }
  if (currentBlock.getLength() == 0) {
    if (currentBlock.getType() == newType) {
      console.log('same block types');
      return editorState;
    }
    const newBlock = currentBlock.merge({
      type: newType,
      data: getDefaultBlockData(newType),
    });
    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
  } else {
    
  }
  console.log('block length > 0');
  return editorState;
};

export const resetBlockWithType = (editorState, newType=Block.UNSTYLED) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  let newText = "";
  let text = block.getText();
  if (block.getLength() >= 2) {
    newText = text.substr(1);
  }
  const newBlock = block.merge({
    text: newText,
    type: newType,
    data: getDefaultBlockData(newType),
  });
  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};


export const updateDataOfBlock = (editorState, block, newData) => {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  const newBlock = block.merge({
    data: newData
  });
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
  // return editorState;
};
