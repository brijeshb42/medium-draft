import { KeyBindingUtil, getDefaultKeyBinding, RichUtils, ContentBlock, genKey, ContentState, EditorState, SelectionState } from 'draft-js';
const isSoftNewlineEvent = require('draft-js/lib/isSoftNewlineEvent');
import { OrderedMap } from 'immutable';

import { KEY_COMMANDS, KEY_CODES, Block, HANDLED, NOT_HANDLED, StringToTypeMap, continuousBlocks } from '../util/constants';
import { getCurrentBlock, resetBlockWithType, addNewBlockAt } from '../model';
import { DraftPlugin } from '../plugin_editor/Editor';

const { changeType, showLinkInput, unlink } = KEY_COMMANDS;

export default function keyboardPlugin(): DraftPlugin {
  return {
    keyBindingFn(ev: React.KeyboardEvent<{}>) {
      if (KeyBindingUtil.hasCommandModifier(ev) && ev.which === KEY_CODES.K) {
        if (ev.shiftKey) {
          return unlink();
        }
        return showLinkInput();
      }

      if (ev.altKey && !ev.ctrlKey) {
        if (ev.shiftKey) {
          return getDefaultKeyBinding(ev);
        }

        switch(ev.which) {
          case KEY_CODES.ONE:
            return changeType(Block.OL);
          case KEY_CODES.TWO:
            return showLinkInput();
          case KEY_CODES.THREE:
            return changeType(Block.H3);
          case KEY_CODES.EIGHT:
            return changeType(Block.UL);
          case KEY_CODES.COMMA:
            return changeType(Block.CAPTION);
          case KEY_CODES.PERIOD:
            return changeType(Block.UNSTYLED);
        }
      }

      return getDefaultKeyBinding(ev);
    },

    handleKeyCommand(command, editorState, pluginFns) {
      const {
        setEditorState
      } = pluginFns;

      // if (command === KEY_COMMANDS.showLinkInput()) {
      //   if (!mainProps.disableToolbar && this.toolbar) {
      //     // For some reason, scroll is jumping sometimes for the below code.
      //     // Debug and fix it later.
      //     const isCursorLink = isCursorBetweenLink(editorState);
      //     if (isCursorLink) {
      //       this.editLinkAfterSelection(isCursorLink.blockKey, isCursorLink.entityKey);
      //       return HANDLED;
      //     }
      //     this.toolbar.handleLinkInput(null, true);
      //     return HANDLED;
      //   }
      // }

      const block = getCurrentBlock(editorState);
      const currentBlockType = block.getType();

      if (command.indexOf(`${KEY_COMMANDS.changeType()}`) === 0) {
        let newBlockType = command.split(':')[1];

        if (currentBlockType === Block.ATOMIC) {
          return HANDLED;
        }

        if (currentBlockType === Block.BLOCKQUOTE && newBlockType === Block.CAPTION) {
          newBlockType = Block.BLOCKQUOTE_CAPTION;
        } else if (currentBlockType === Block.BLOCKQUOTE_CAPTION && newBlockType === Block.CAPTION) {
          newBlockType = Block.BLOCKQUOTE;
        }

        setEditorState(RichUtils.toggleBlockType(editorState, newBlockType));
        return HANDLED;
      } else if (command.indexOf(`${KEY_COMMANDS.toggleInline()}`) === 0) {
        const inline = command.split(':')[1];
        setEditorState(RichUtils.toggleInlineStyle(editorState, inline));
        return HANDLED;
      } else if (command === 'backspace' && currentBlockType === Block.CODE && !block.getText().length) {
        setEditorState(resetBlockWithType(editorState));
        return HANDLED;
      }

      const newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        setEditorState(newState);
        return HANDLED;
      }

      return NOT_HANDLED;
    },

    handleBeforeInput(inputString, editorState, pluginFns) {
      const { setEditorState } = pluginFns;
      const mapping = StringToTypeMap;
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

      setEditorState(resetBlockWithType(editorState, fType, {
        text: '',
      }));
      return HANDLED;
    },

    handleReturn(ev, editorState, { setEditorState }) {
      const currentBlock = getCurrentBlock(editorState);
      const blockType = currentBlock.getType();

      if (isSoftNewlineEvent(ev)) {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return HANDLED;
      }

      if (!ev.altKey || !ev.metaKey || !ev.ctrlKey) {
        if (blockType.indexOf(Block.ATOMIC) === 0) {
          setEditorState(addNewBlockAt(editorState, currentBlock.getKey()));
          return HANDLED;
        }

        if (!currentBlock.getLength()) {
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
              setEditorState(resetBlockWithType(editorState, Block.UNSTYLED));
              return HANDLED;
            default:
              return NOT_HANDLED;
          }
        }

        const selection = editorState.getSelection();

        if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
          if (continuousBlocks.indexOf(blockType) < 0) {
            setEditorState(addNewBlockAt(editorState, currentBlock.getKey()));
            return HANDLED;
          }
          return NOT_HANDLED;
        }
        return NOT_HANDLED;
      }

      return NOT_HANDLED;
    },

    onTab(ev, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      const newEditorState = RichUtils.onTab(ev, editorState, 2);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
    },

    onUpArrow(ev, { getEditorState, setEditorState }) {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) {
        return false;
      }

      const editorState = getEditorState();
      const content = editorState.getCurrentContent();
      const selection = editorState.getSelection();

      if (!selection.isCollapsed()) {
        return false;
      }

      const key = selection.getAnchorKey();
      const currentBlock = content.getBlockForKey(key);
      const firstBlock = content.getFirstBlock();

      if (firstBlock.getKey() === key) {
        if (firstBlock.getType().indexOf(Block.ATOMIC) === 0) {
          ev.preventDefault();
          const newBlock = new ContentBlock({
            type: Block.UNSTYLED,
            key: genKey(),
          });
          const newBlockMap = OrderedMap([[newBlock.getKey(), newBlock]]).concat(content.getBlockMap());
          const newContent = <ContentState>content.merge({
            blockMap: newBlockMap,
            selectionAfter: selection.merge({
              anchorKey: newBlock.getKey(),
              focusKey: newBlock.getKey(),
              anchorOffset: 0,
              focusOffset: 0,
              isBackward: false,
            }),
          });
          setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));
          return true;
        }
      } else if (currentBlock.getType().indexOf(Block.ATOMIC) === 0) {
        const blockBefore = content.getBlockBefore(key);
        if (!blockBefore) {
          return;
        }
        ev.preventDefault();
        const newSelection = <SelectionState>selection.merge({
          anchorKey: blockBefore.getKey(),
          focusKey: blockBefore.getKey(),
          anchorOffset: blockBefore.getLength(),
          focusOffset: blockBefore.getLength(),
          isBackward: false,
        });
        setEditorState(EditorState.forceSelection(editorState, newSelection));
        return true;
      }
    }
  };
}
