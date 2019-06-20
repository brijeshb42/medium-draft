import { convertFromHTML } from 'draft-convert';
import { Inline, Block, Entity as EntityType } from './util/constants';

export const htmlToStyle = (nodeName, node, currentStyle) => {
  switch (nodeName) {
    case 'em':
      return currentStyle.add(Inline.ITALIC);
    case 'strong':
      return currentStyle.add(Inline.BOLD);
    case 'strike':
      return currentStyle.add(Inline.STRIKETHROUGH);
    case 'u':
      return currentStyle.add(Inline.UNDERLINE);
    case 'span':
      if (node.className === `md-inline-${Inline.HIGHLIGHT.toLowerCase()}`) {
        return currentStyle.add(Inline.HIGHLIGHT);
      }
      break;
    case 'code':
      return currentStyle.add(Inline.CODE);
    default:
      break;
  }

  return currentStyle;
};

export const htmlToEntity = (nodeName, node, createEntity) => {
  if (nodeName === 'a') {
    return createEntity(EntityType.LINK, 'MUTABLE', { url: node.href });
  }
  return undefined;
};

export const htmlToBlock = (nodeName, node) => {
  if (nodeName === 'h1') {
    return {
      type: Block.H1,
      data: {},
    };
  } else if (nodeName === 'h2') {
    return {
      type: Block.H2,
      data: {},
    };
  } else if (nodeName === 'h3') {
    return {
      type: Block.H3,
      data: {},
    };
  } else if (nodeName === 'h4') {
    return {
      type: Block.H4,
      data: {},
    };
  } else if (nodeName === 'h5') {
    return {
      type: Block.H5,
      data: {},
    };
  } else if (nodeName === 'h6') {
    return {
      type: Block.H6,
      data: {},
    };
  } else if (nodeName === 'p' && (
    node.className === `md-block-${Block.CAPTION.toLowerCase()}` ||
    node.className === `md-block-${Block.BLOCKQUOTE_CAPTION.toLowerCase()}`
  )) {
    return {
      type: Block.BLOCKQUOTE_CAPTION,
      data: {},
    };
  } else if (nodeName === 'figure') {
    if (node.className.match(/^md-block-image/)) {
      const imageNode = node.querySelector('img');
      return {
        type: Block.IMAGE,
        data: {
          src: imageNode && imageNode.src,
        },
      };
    } else if (node.className === `md-block-${Block.ATOMIC.toLowerCase()}`) {
      return {
        type: Block.ATOMIC,
        data: {},
      };
    }
    return undefined;
  } else if (nodeName === 'div' && node.className && node.className.match(/^md-block-todo/)) {
    const inputNode = node.querySelector('input');
    return {
      type: Block.TODO,
      data: {
        checked: inputNode && inputNode.checked,
      },
    };
  } else if (nodeName === 'hr') {
    return {
      type: Block.BREAK,
      data: {},
    };
  } else if (nodeName === 'blockquote') {
    return {
      type: Block.BLOCKQUOTE,
      data: {},
    };
  } else if (nodeName === 'p') {
    return {
      type: Block.UNSTYLED,
      data: {},
    };
  } else if (['div', 'pre'].includes(nodeName) && node.className === 'md-block-code-container') {
    return {
      type: Block.CODE,
      data: {},
    };
  }

  return undefined;
};

export const options = {
  htmlToStyle,
  htmlToEntity,
  htmlToBlock,
};

export const setImportOptions = (htmlOptions = options) => convertFromHTML(htmlOptions);

export default (rawHTML, htmlOptions = options) => convertFromHTML(htmlOptions)(rawHTML);
