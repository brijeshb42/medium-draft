import { genKey, EditorState, ContentBlock, SelectionState } from 'draft-js';

import { Block, BASE_BLOCK_CLASS, NOT_HANDLED, HANDLED } from "../util/constants";
import ImageBlock from "../components/blocks/image";
import { addNewBlockAt, addNewBlock, updateDataOfBlock, resetBlockWithType } from "../model";
import { DraftPlugin } from "../plugin_editor/Editor";

export type ImageUploadFunction = (files: Array<Blob>) => Promise<Array<string>>;

export interface ImagePluginOptionType {
  /**
   * A method that returns a Promise and resolves with the url of uploaded image.
   */
  uploadImage?: ImageUploadFunction;
};

function shouldEarlyReturn(block: ContentBlock): boolean {
  return (block.getType() !== Block.IMAGE);
}

/**
 * If file upload function is not provided, this is used to simulate
 * uploading for 1 sec.
 * @param files
 */
function dummyUploadImage(files: Array<Blob>): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(files.map(fl => URL.createObjectURL(fl)));
    }, 1000);
  });
};

export default function imageBlockPlugin(options?: ImagePluginOptionType): DraftPlugin {
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

      const blockData = block.getData()
      const uploading = blockData.has('uploading') && blockData.get('uploading', false);
      const imgClass = `${BASE_BLOCK_CLASS}-image`;

      return `${BASE_BLOCK_CLASS} ${imgClass} ${uploading ? `${imgClass}--uploading` : ''}`;
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
      
      let newEditorState: EditorState;
      let src = URL.createObjectURL(imageFiles[0]);
      let newBlockKey: string;

      if (!block.getLength() && block.getType().indexOf('atomic') < 0) {
        newBlockKey = block.getKey();
        newEditorState = addNewBlock(
          editorState,
          Block.IMAGE, {
            src,
            uploading: true,
          }
        );
      } else {
        newBlockKey = genKey();
        newEditorState = addNewBlockAt(
          editorState,
          currentBlockKey,
          Block.IMAGE, {
            src,
            uploading: true,
          },
          newBlockKey,
        );
      }

      setEditorState(EditorState.forceSelection(newEditorState, new SelectionState({
        focusKey: newBlockKey,
        anchorKey: newBlockKey,
        focusOffset: 0,
      })));

      const uploadImage = (options && options.uploadImage) ? options.uploadImage : dummyUploadImage;
      uploadImage(imageFiles).then((images) => {
        const editorState = getEditorState();
        const block = editorState.getCurrentContent().getBlockForKey(newBlockKey);
        newEditorState = updateDataOfBlock(editorState, block, {
          src: images[0],
        });
        URL.revokeObjectURL(src);
        setEditorState(newEditorState);
      }).catch(() => {
        const editorState = getEditorState();
        resetBlockWithType(editorState, Block.UNSTYLED, {});
      });
      return HANDLED;
    },

    // handleDrop(selection, dt, isInternal) {
    //   return NOT_HANDLED;
    // },
  };
}
