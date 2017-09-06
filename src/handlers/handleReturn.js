/**
 * By default, it handles return key for inserting soft breaks (BRs in HTML) and
 * also instead of inserting a new empty block after current empty block, it first check
 * whether the current block is of a type other than `unstyled`. If yes, current block is
 * simply converted to an unstyled empty block. If RETURN is pressed on an unstyled block
 * default behavior is executed.
 */

import { RichUtils } from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';

import { Block, HANDLED, NOT_HANDLED } from '../util/constants';
import { getCurrentBlock, addNewBlockAt, resetBlockWithType } from '../model/';

/**
 * Add a line break within the block if Shift+ENTER is pressed
 */
export const handleSoftReturn = (e, { getEditorState }) => {
  const editorState = getEditorState();
  if (!isSoftNewlineEvent(e)) {
    return editorState;
  }
  return RichUtils.insertSoftNewline(editorState);
};


/**
 * Add a new unstyled block if RETURN is pressed from within ATOMIC block.
 */
export const handleReturnFromAtomicBlock = (e, { getEditorState }) => {
  const editorState = getEditorState();
  if (e.altKey || e.metaKey || e.ctrlKey) {
    return editorState;
  }
  const currentBlock = getCurrentBlock(editorState);
  const blockType = currentBlock.getType();
  if (blockType.indexOf(Block.ATOMIC) !== 0) {
    return editorState;
  }
  return addNewBlockAt(editorState, currentBlock.getKey());
};


/**
 * If RETURN is pressed in one of empty BLOCKQUOTE, UL, OL, CAPTIONs,
 * TODOs or HEADINGs blocks, reset the block type to unstyled.
 */
export const handleReturnInEmptyBlocks = (e, { getEditorState }) => {
  const editorState = getEditorState();
  const currentBlock = getCurrentBlock(editorState);
  if (currentBlock.getLength() !== 0) {
    return editorState;
  }

  const blockType = currentBlock.getType();

  switch (blockType) {
    case Block.UL:
    case Block.OL:
    case Block.BLOCKQUOTE:
    case Block.BLOCKQUOTE_CAPTION:
    case Block.CAPTION:
    case Block.TODO:
    case Block.H2:
    case Block.H3:
    case Block.H1:
      return resetBlockWithType(editorState, Block.UNSTYLED);
    default:
      return editorState;
  }
};

/**
 * By default, RETURN press when the cursor is at the end of a block,
 * adds a new block of the same type. So, if current block type is not in
 * `continuousBlocks`, add a new UNSTYLED block instead.
 */
export const handleReturnInNonContinuousBlock = (e, {
    getEditorState, continuousBlocks = [],
  }) => {
  const editorState = getEditorState();
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) {
    return editorState;
  }
  const currentBlock = getCurrentBlock(editorState);
  if (currentBlock.getLength() !== selection.getStartOffset()) {
    return editorState;
  }
  const blockType = currentBlock.getType();
  if (continuousBlocks.indexOf(blockType) >= 0) {
    return editorState;
  }
  return addNewBlockAt(editorState, currentBlock.getKey());
};


export const handlerList = [
  handleSoftReturn,
  handleReturnFromAtomicBlock,
  handleReturnInEmptyBlocks,
  handleReturnInNonContinuousBlock,
];

const handleReturn = (e, options, handlers = handlerList) => {
  const originalEs = options.getEditorState();
  let editorState = originalEs;

  const _getEs = () => editorState;
  let behavior = NOT_HANDLED;

  for (const handler of handlers) {
    editorState = handler(e, {
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

export default handleReturn;
