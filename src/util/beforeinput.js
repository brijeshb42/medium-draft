import { resetBlockWithType, getCurrentBlock } from 'model/index';
import { Block } from './constants';

export const StringToTypeMap = {
  '--': `${Block.BLOCKQUOTE}:${Block.BLOCKQUOTE_CAPTION}:${Block.CAPTION}`,
  '""': Block.BLOCKQUOTE,
  '> ': Block.BLOCKQUOTE,
  '\'\'': Block.BLOCKQUOTE,
  '*.': Block.UL,
  '* ': Block.UL,
  '- ': Block.UL,
  '1.': Block.OL,
  '# ': Block.H1,
  '##': Block.H2,
  '==': Block.UNSTYLED,
  '[]': Block.TODO,
};

export default (editorState, str, onChange, mapping=StringToTypeMap) => {
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
  let fType = finalType[0];
  if (finalType.length == 1) {
    if (blockType == finalType[0]) {
      return false;
    }
  } else if (finalType.length == 2) {
    if (blockType == finalType[1]) {
      return false;
    }
    if (blockType == finalType[0]) {
      fType = finalType[1];
    }
  } else if (finalType.length == 3) {
    if (blockType == finalType[2]) {
      return false;
    }
    if (blockType == finalType[0]) {
      fType = finalType[1];
    } else {
      fType = finalType[2];
    }
  }
  onChange(resetBlockWithType(editorState, fType));
  return true;
}
