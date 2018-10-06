import { DraftPlugin } from "draft-js-plugins-editor";

import TextBlock from '../components/blocks/text';
import { Block } from "../util/constants";

export default function blockRendererPlugin(): DraftPlugin {
  return {
    blockRendererFn(contentBlock) {
      const blockType = contentBlock.getType();

      switch (blockType) {
        case Block.UNSTYLED:
        case Block.PARAGRAPH:
          return {
            component: TextBlock,
          };
        default:
          return null;
      }
    }
  };
}
