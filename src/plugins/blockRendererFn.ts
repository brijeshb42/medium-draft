import { DraftPlugin } from "draft-js-plugins-editor";

import QuoteCaptionBlock from '../components/blocks/blockquotecaption';
import CaptionBlock from '../components/blocks/caption';
import AtomicBlock from '../components/blocks/atomic';
import TodoBlock from '../components/blocks/todo';
import ImageBlock from '../components/blocks/image';
import BreakBlock from '../components/blocks/break';
import TextBlock from '../components/blocks/text';
import CodeBlock from '../components/blocks/code';
import { Block } from "../util/constants";

export default function blockRendererPlugin(): DraftPlugin {
  return {
    blockRendererFn(contentBlock, pluginFns) {
      const { getEditorState, setEditorState } = pluginFns;
      const blockType = contentBlock.getType();

      switch (blockType) {
        case Block.UNSTYLED:
        case Block.PARAGRAPH:
          return {
            component: TextBlock,
          };
        case Block.BLOCKQUOTE_CAPTION:
          return {
            component: QuoteCaptionBlock,
          };
        case Block.CAPTION: return {
          component: CaptionBlock,
        };
        case Block.ATOMIC: return {
          component: AtomicBlock,
          editable: false,
          props: {
            getEditorState,
          },
        };
        case Block.TODO: return {
          component: TodoBlock,
          props: {
            setEditorState,
            getEditorState,
          },
        };
        case Block.IMAGE: return {
          component: ImageBlock,
          props: {
            setEditorState,
            getEditorState,
          },
        };
        case Block.BREAK: return {
          component: BreakBlock,
          editable: false,
        };
        case Block.CODE: return {
          component: CodeBlock,
          props: {
            setEditorState,
            getEditorState,
          },
        };
        default:
          return null;
      }
    }
  };
}
