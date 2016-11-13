import { resetBlockWithType, getCurrentBlock } from '../model';
import { Block, HANDLED, NOT_HANDLED } from './constants';


/*
This is a key value pair where the key is the string that is input while typing.
While typing in an empty block, if the entered text matches any of the keys in
this dictionary, that particular block's type will be changed to the value
associated with that key.
*/
export const StringToTypeMap = {
  '--': `${Block.BLOCKQUOTE}:${Block.BLOCKQUOTE_CAPTION}:${Block.CAPTION}`,
  '> ': Block.BLOCKQUOTE,
  '*.': Block.UL,
  '* ': Block.UL,
  '- ': Block.UL,
  '1.': Block.OL,
  '# ': Block.H1,
  '##': Block.H2,
  '==': Block.UNSTYLED,
  '[]': Block.TODO,
};


/*
This function is called before text is input in a block in `draft-js`. It checks
whether the input string (first 2 cahracters only) is present in the `StringToTypeMap`
mapping or not. If present, it converts the current block's type and called the `editor`'s
`onChange` function. Otherwise, does nothing. By defualt, the above key-value mapping
is passed. In custom implementation, users can pass their own mapping or extend
the current one.
*/
const beforeInput = (editorState, inputString, onChange, mapping = StringToTypeMap) => {
  const selection = editorState.getSelection();
  const block = getCurrentBlock(editorState);
  const blockType = block.getType();
  if (blockType.indexOf(Block.ATOMIC) === 0) {
    return NOT_HANDLED;
  }
  const blockLength = block.getLength();
  if (selection.getAnchorOffset() > 1 || blockLength > 1) {
    return NOT_HANDLED;
  }
  const blockTo = mapping[block.getText()[0] + inputString];
  if (!blockTo) {
    return NOT_HANDLED;
  }
  const finalType = blockTo.split(':');
  if (finalType.length < 1 || finalType.length > 3) {
    return NOT_HANDLED;
  }
  let fType = finalType[0];
  if (finalType.length === 1) {
    if (blockType === finalType[0]) {
      return NOT_HANDLED;
    }
  } else if (finalType.length === 2) {
    if (blockType === finalType[1]) {
      return NOT_HANDLED;
    }
    if (blockType === finalType[0]) {
      fType = finalType[1];
    }
  } else if (finalType.length === 3) {
    if (blockType === finalType[2]) {
      return NOT_HANDLED;
    }
    if (blockType === finalType[0]) {
      fType = finalType[1];
    } else {
      fType = finalType[2];
    }
  }
  onChange(resetBlockWithType(editorState, fType, {
    text: '',
  }));
  return HANDLED;
};


export default beforeInput;
