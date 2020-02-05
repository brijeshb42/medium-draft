import { Block } from './constants';

/*
Get custom classnames for each of the different block types supported.
*/

export default (block) => {
  const classFromData = block.getData().get('class');
  const customClassToApply = classFromData ? `${classFromData} ` : '';
  const BASE_BLOCK_CLASS = `${customClassToApply}md-block`;

  switch (block.getType()) {
    case Block.BLOCKQUOTE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote md-RichEditor-blockquote`;
    case Block.UNSTYLED:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`;
    case Block.ATOMIC:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`;
    case Block.CAPTION:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-caption`;
    case Block.TODO: {
      const data = block.getData();
      const checkedClass = data.get('checked') === true ?
        `${BASE_BLOCK_CLASS}-todo-checked` : `${BASE_BLOCK_CLASS}-todo-unchecked`;
      let finalClass = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph `;
      finalClass += `${BASE_BLOCK_CLASS}-todo ${checkedClass}`;
      return finalClass;
    }
    case Block.IMAGE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-image`;
    case Block.BLOCKQUOTE_CAPTION: {
      const cls = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote`;
      return `${cls} md-RichEditor-blockquote ${BASE_BLOCK_CLASS}-quote-caption`;
    }
    case Block.CODE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-code-block`;
    default: return BASE_BLOCK_CLASS;
  }
};
