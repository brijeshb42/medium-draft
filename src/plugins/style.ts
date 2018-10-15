import * as Immutable from 'immutable';
import { DraftPlugin } from 'draft-js-plugins-editor';

import { Block, Inline } from '../util/constants';

const BASE_BLOCK_CLASS = 'md-block';

/**
 * Base plugin that provides styling and structuring to the editor.
 */
export default function createInlineStylePlugin(): DraftPlugin {
  return {
    blockStyleFn(contentBlock) {
      const blockType = contentBlock.getType();

      switch(blockType) {
        case Block.BLOCKQUOTE:
          return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote md-RichEditor-blockquote`;
          case Block.UNSTYLED:
          return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`;
        case Block.ATOMIC:
          return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`;
        case Block.CAPTION:
          return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-caption`;
        case Block.TODO: {
          const data = contentBlock.getData();
          const checkedClass = data.get('checked') === true ?
            `${BASE_BLOCK_CLASS}-todo-checked` : `${BASE_BLOCK_CLASS}-todo-unchecked`;
          let finalClass = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph `;
          finalClass += `${BASE_BLOCK_CLASS}-todo ${checkedClass}`;
          return finalClass;
        }
        case Block.BLOCKQUOTE_CAPTION: {
          const cls = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote`;
          return `${cls} md-RichEditor-blockquote ${BASE_BLOCK_CLASS}-quote-caption`;
        }
        default:
          return null;
      }
    },
    customStyleMap: {
      [Inline.HIGHLIGHT]: {
        backgroundColor: 'yellow',
      },
      [Inline.CODE]: {
        fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
        margin: '4px 0',
        fontSize: '0.9em',
        padding: '1px 3px',
        color: '#555',
        backgroundColor: '#fcfcfc',
        border: '1px solid #ccc',
        borderBottomColor: '#bbb',
        borderRadius: 3,
        boxShadow: 'inset 0 -1px 0 #bbb',
      },
    },
    blockRenderMap: Immutable.Map({
      [Block.CAPTION]: {
        element: 'cite',
      },
      [Block.BLOCKQUOTE_CAPTION]: {
        element: 'blockquote',
      },
      [Block.TODO]: {
        element: 'div',
      },
      [Block.IMAGE]: {
        element: 'figure',
      },
      [Block.BREAK]: {
        element: 'div',
      },
      [Block.UNSTYLED]: {
        element: 'div',
        aliasedElements: ['p', 'div'],
      },
    }),
  };
}
