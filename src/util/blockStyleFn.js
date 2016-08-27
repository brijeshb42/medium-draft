import { Block } from './constants';

/*
Get custom classnames for each of the different block types supported.
*/
export default (block) => {
  switch (block.getType()) {
    case Block.BLOCKQUOTE: return 'block block-quote RichEditor-blockquote';
    case Block.UNSTYLED: return 'block block-paragraph';
    case Block.ATOMIC: return 'block block-atomic';
    case Block.CAPTION: return 'block block-caption';
    case Block.TODO: return 'block block-paragraph block-todo';
    case Block.IMAGE: return 'block block-image';
    case Block.BLOCKQUOTE_CAPTION:
      return 'block block-quote RichEditor-blockquote block-quote-caption';
    default: return 'block';
  }
};
