import { KeyBindingUtil, RichUtils, EditorState, Modifier } from "draft-js";

import CodeBlock from '../components/blocks/code';
import { getCurrentBlock, updateDataOfBlock } from "../model";
import { Block, NOT_HANDLED, HANDLED, BASE_BLOCK_CLASS, KEY_CODES } from "../util/constants";
import { DraftPlugin } from "../plugin_editor/Editor";

type OptionType = {
  ignoreCommands?: Array<string>,
  tabSize?: 2 | 4,
};

function shouldEarlyReturn(block: Draft.ContentBlock): boolean {
  return (block.getType() !== Block.CODE);
}

export default function codeBlockPlugin(options?: OptionType): DraftPlugin {
  const ignoreCommands = (options && options.ignoreCommands) || ['bold', 'italic', 'underline'];
  const tabSize = (options && options.tabSize) ? options.tabSize : 2;

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

    keyBindingFn(ev, { getEditorState }) {
      const editorState = getEditorState();
      if (shouldEarlyReturn(getCurrentBlock(editorState))) {
        return;
      }

      if (ev.ctrlKey && ev.shiftKey && ev.which === KEY_CODES.L) {
        return 'code-block-add-language';
      }
    },

    handleKeyCommand(command, editorState, { setEditorState, getProps }) {
      const block = getCurrentBlock(editorState);

      if (shouldEarlyReturn(block)) {
        return NOT_HANDLED;
      }

      if (ignoreCommands.indexOf(command) >= 0) {
        return HANDLED;
      }

      if (command === 'code-block-add-language') {
        const data = block.getData();
        const props = getProps();

        if (props.getParentMethods) {
          props.getParentMethods()
            .getInput('Enter language for the code block')
            .then((lang) => {
              const newData = data.set('language', lang);
              setEditorState(updateDataOfBlock(editorState, block, newData));
            }).catch(() => {});
          return HANDLED;
        } else {
          const lang = prompt('Set Language:', data.get('language') || '');

          if (lang) {
            const newData = data.set('language', lang);
            setEditorState(updateDataOfBlock(editorState, block, newData));
          }
          return HANDLED;
        }
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

    onTab(ev, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      const currentBlock = getCurrentBlock(editorState);
      const selection = editorState.getSelection();

      if (shouldEarlyReturn(currentBlock) || !selection.isCollapsed()) {
        return null;
      }

      ev.preventDefault();
      let str: string = '';
      for(let i = 0; i < tabSize; i++) {
        str += ' ';
      }

      const contentState = Modifier.insertText(editorState.getCurrentContent(), selection, str);
      const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
      setEditorState(EditorState.forceSelection(newEditorState, contentState.getSelectionAfter()));
    }
  };
};
