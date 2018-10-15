import { DraftPlugin } from "draft-js-plugins-editor";

import { Block, BASE_BLOCK_CLASS, NOT_HANDLED, HANDLED } from "../util/constants";
import ImageBlock from "../components/blocks/image";
import { addNewBlockAt, addNewBlock } from "../model";

type OptionType = {
  uploadImage?: (files: Array<Blob>) => Promise<Array<string>>;
};

function shouldEarlyReturn(block: Draft.ContentBlock): boolean {
  return (block.getType() !== Block.IMAGE);
}

export default function imageBlockPlugin(options?: OptionType): DraftPlugin {
  const uploadImage: (files: Array<Blob>) => Promise<Array<string>> = (options && options.uploadImage) ? options.uploadImage : (files: Array<Blob>) => {
    return Promise.resolve(files.map(fl => URL.createObjectURL(fl)));
  };

  return {
    blockRendererFn(block, { getEditorState, setEditorState }) {
      if (shouldEarlyReturn(block)) {
        return null;
      }

      return {
        component: ImageBlock,
        props: {
          getEditorState,
          setEditorState,
        },
      };
    },

    blockStyleFn(block) {
      if (shouldEarlyReturn(block)) {
        return null;
      }

      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-image`;
    },

    handleDroppedFiles(selection, files, { getEditorState, setEditorState }) {
      if (!selection.isCollapsed() || !files.length) {
        return NOT_HANDLED;
      }

      const imageFiles = files.filter(file => file.type.indexOf('image/') === 0);

      if (!imageFiles) {
        return NOT_HANDLED;
      }

      const editorState = getEditorState();
      const currentBlockKey = selection.getIsBackward() ? selection.getFocusKey() : selection.getAnchorKey();
      const block = editorState.getCurrentContent().getBlockForKey(currentBlockKey);
      
      let newEditorState: Draft.EditorState;

      uploadImage(imageFiles).then((images) => {
        console.log(images);
        const src = images[0];
        if (!block.getLength() && block.getType().indexOf('atomic') < 0) {
          newEditorState = addNewBlock(editorState, Block.IMAGE, {
            src,
          });
        } else {
          newEditorState = addNewBlockAt(
            editorState,
            currentBlockKey,
            Block.IMAGE, {
              src,
            }
          );
        }

        setEditorState(newEditorState);
      });
      return HANDLED;
    },

    handleDrop(selection, dt, isInternal) {
      console.log(selection.toJS(), dt, isInternal);
      return NOT_HANDLED;
    },
  };
}
