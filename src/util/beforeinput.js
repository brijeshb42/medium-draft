import { resetBlockWithType, getCurrentBlock } from 'model/index';

export const StringToTypeMap = {
  '--': 'blockquote:block-quote-caption:caption',
  '""': 'blockquote',
  '\'\'': 'blockquote',
  '* ': 'unordered-list-item',
  '1.': 'ordered-list-item',
  '##': 'header-three',
  '==': 'unstyled'
};

export default (editorState, str, callback, mapping=StringToTypeMap) => {
  const selection = editorState.getSelection();
  const block = getCurrentBlock(editorState);
  const blockType = block.getType();
  const blockLength = block.getLength();
  if (selection.getAnchorOffset() > 1 || blockLength > 1) {
    return false;
  }
  const blockTo = mapping[block.getText()[0] + str];
  if (!blockTo) {
    return false;
  }
  const finalType = blockTo.split(':');
  if (finalType.length < 1 || finalType.length > 3) {
    return false;
  }
  if (finalType.length == 1) {
    if (blockType == finalType[0]) {
      return false;
    }
    callback(resetBlockWithType(editorState, finalType[0]));
  } else if (finalType.length == 2) {
    if (blockType == finalType[1]) {
      return false;
    }
    if (blockType == finalType[0]) {
      callback(resetBlockWithType(editorState, finalType[1]));
    }
  } else if (finalType.length == 3) {
    if (blockType == finalType[2]) {
      return false;
    }
    if (blockType == finalType[0]) {
      callback(resetBlockWithType(editorState, finalType[1]));
    } else {
      callback(resetBlockWithType(editorState, finalType[2]));
    }
  }
  return true;
}
