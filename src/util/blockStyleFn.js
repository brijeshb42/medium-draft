import { Block } from './constants';

/*
Get custom classnames for each of the different block types supported.
*/

const BASE_BLOCK_CLASS = 'md-block';

export default (block) => {
  switch (block.getType()) {
    case Block.BLOCKQUOTE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote RichEditor-blockquote`;
    case Block.UNSTYLED:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`;
    case Block.ATOMIC:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`;
    case Block.CAPTION:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-caption`;
    case Block.TODO:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph ${BASE_BLOCK_CLASS}-todo`;
    case Block.IMAGE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-image`;
    case Block.BLOCKQUOTE_CAPTION: {
      const cls = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote`;
      return `${cls} RichEditor-blockquote ${BASE_BLOCK_CLASS}-quote-caption`;
    }
    default: return `${BASE_BLOCK_CLASS}`;
  }
};
