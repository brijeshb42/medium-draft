/**
 * Handles custom commands based on various key combinations. First checks
 * for some built-in commands. If found, that command's function is apllied and returns.
 * If not found, it checks whether parent component handles that command or not.
 * Some of the internal commands are:
 * - showlinkinput -> Opens up the link input tooltip if some text is selected.
 * - add-new-block -> Adds a new block at the current cursor position.
 * - changetype:block-type -> If the command starts with `changetype:` and
 *   then succeeded by the block type, the current block will be converted to that particular type.
 * - toggleinline:inline-type -> If the command starts with `toggleinline:` and
 *   then succeeded by the inline type, the current selection's inline type will be
 *   toggled.
 */
import { EditorState, SelectionState, RichUtils } from 'draft-js';

import { HANDLED, NOT_HANDLED, KEY_COMMANDS, Block } from '../util/constants';
import { isCursorBetweenLink, getCurrentBlock } from '../model/';

export const handleShowLinkInput = (command, {
  getEditorState,
  disableToolbar,
  toolbar,
}) => {
  const editorState = getEditorState();
  if (command !== KEY_COMMANDS.showLinkInput()) {
    return editorState;
  }
  if (disableToolbar || !toolbar) {
    return editorState;
  }
  const isCursorLink = isCursorBetweenLink(editorState);
  if (!isCursorLink) {
    toolbar.handleLinkInput(null, true);
    return editorState;
  }
  const content = editorState.getCurrentContent();
  const { blockKey, entityKey } = isCursorLink;

  // if (entityKey === null) {
  //   return editorState;
  // }

  const block = content.getBlockForKey(blockKey);
  let newEditorState = editorState;
  block.findEntityRanges((character) => {
    const eKey = character.getEntity();
    return eKey === entityKey;
  }, (start, end) => {
    const selection = new SelectionState({
      anchorKey: blockKey,
      focusKey: blockKey,
      anchorOffset: start,
      focusOffset: end,
    });
    newEditorState = EditorState.forceSelection(editorState, selection);
  });

  if (newEditorState !== editorState) {
    setTimeout(() => {
      toolbar.handleLinkInput(null, true);
    }, 100);
  }
  return newEditorState;
};


export const handleUnlink = (command, { getEditorState }) => {
  const editorState = getEditorState();

  if (command !== KEY_COMMANDS.unlink()) {
    return editorState;
  }
  const isCursorLink = isCursorBetweenLink(editorState);
  if (!isCursorLink) {
    return editorState;
  }

  const { blockKey, entityKey } = isCursorLink;
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(blockKey);
  const oldSelection = editorState.getSelection();
  let newEditorState = editorState;

  block.findEntityRanges((character) => {
    const eKey = character.getEntity();
    return eKey === entityKey;
  }, (start, end) => {
    const selection = new SelectionState({
      anchorKey: blockKey,
      focusKey: blockKey,
      anchorOffset: start,
      focusOffset: end,
    });
    newEditorState = EditorState.forceSelection(RichUtils.toggleLink(editorState, selection, null), oldSelection);
  });
  return newEditorState;
};


export const handleBlockCommand = (command, { getEditorState }) => {
  const editorState = getEditorState();
  if (command.indexOf(KEY_COMMANDS.changeType()) !== 0) {
    return editorState;
  }
  const block = getCurrentBlock(editorState);
  const currentBlockType = block.getType();

  if (currentBlockType === Block.ATOMIC) {
    return editorState;
  }

  let newBlockType = command.split(':')[1];
  if (currentBlockType === Block.BLOCKQUOTE && newBlockType === Block.CAPTION) {
    newBlockType = Block.BLOCKQUOTE_CAPTION;
  } else if (currentBlockType === Block.BLOCKQUOTE_CAPTION &&
             newBlockType === Block.CAPTION) {
    newBlockType = Block.BLOCKQUOTE;
  }
  return RichUtils.toggleBlockType(editorState, newBlockType);
};


export const handleInlineCommand = (command, { getEditorState }) => {
  const editorState = getEditorState();
  if (command.indexOf(KEY_COMMANDS.toggleInline()) !== 0) {
    return editorState;
  }
  const inlineStyle = command.split(':')[1];
  return RichUtils.toggleInlineStyle(editorState, inlineStyle);
};


export const handlerList = [
  handleShowLinkInput,
  handleUnlink,
  handleBlockCommand,
  handleInlineCommand,
];

const handleKeyCommand = (command, es, options, handlers = handlerList) => {
  const originalEs = options.getEditorState();
  let editorState = originalEs;

  const _getEs = () => editorState;
  let behavior = NOT_HANDLED;

  for (let i = 0; i < handlers.length; i += 1) {
    const handler = handlers[i];
    editorState = handler(command, {
      ...options,
      getEditorState: _getEs,
    });
    if (editorState !== originalEs) {
      options.setEditorState(editorState, options.focus);
      behavior = HANDLED;
      break;
    }
  }
  if (behavior === NOT_HANDLED) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      options.setEditorState(newState);
    }
  }
  return behavior;
};

export default handleKeyCommand;
