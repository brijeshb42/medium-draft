import { KeyBindingUtil, RichUtils, EditorState, Modifier } from "draft-js";

import CodeBlock from '../components/blocks/code';
import { getCurrentBlock } from "../model";
import { Block, NOT_HANDLED, HANDLED, BASE_BLOCK_CLASS } from "../util/constants";
import { DraftPlugin } from "../plugin_editor/Editor";

type OptionType = {
  ignoreCommands?: Array<string>,
};

function shouldEarlyReturn(block: Draft.ContentBlock): boolean {
  return (block.getType() !== Block.CODE);
}

export default function codeBlockPlugin(options?: OptionType): DraftPlugin {
  const ignoreCommands = (options && options.ignoreCommands) || ['bold', 'italic', 'underline'];

  return {
    blockRendererFn(block, { setEditorState, getEditorState }) {
      if (shouldEarlyReturn(block)) {
        return null;
      }

      return {
        component: CodeBlock,
        props: {
          setEditorState,
          getEditorState,
        },
      }
    },

    blockStyleFn(block) {
      if (shouldEarlyReturn(block)) {
        return null;
      }

      const data = block.getData();
      const lang = data.get('language', 'no-lang');
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-code language-${lang || 'no-lang'}`;
    },

    handleKeyCommand(command, editorState) {
      if (shouldEarlyReturn(getCurrentBlock(editorState))) {
        return NOT_HANDLED;
      }

      if (ignoreCommands.indexOf(command) >= 0) {
        return HANDLED;
      }

      return NOT_HANDLED;
    },

    handleReturn(ev, editorState, { setEditorState }) {
      if (shouldEarlyReturn(getCurrentBlock(editorState))) {
        return NOT_HANDLED;
      }

      if (KeyBindingUtil.hasCommandModifier(ev)) {
        return NOT_HANDLED;
      }

      setEditorState(RichUtils.insertSoftNewline(editorState));
      return HANDLED;
    },

    handlePastedText(text, html, editorState, { setEditorState }) {
      const currentBlock = getCurrentBlock(editorState);
      
      if (shouldEarlyReturn(currentBlock)) {
        return NOT_HANDLED;
      }

      const content = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const insertOrReplace = selection.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
      setEditorState(
        EditorState.push(
          editorState,
          insertOrReplace(
            content,
            editorState.getSelection(),
            text
          ),
          'insert-characters'
        )
      );
      return HANDLED;
    },
  };
};
