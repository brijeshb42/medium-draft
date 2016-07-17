import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

const RenderMap = Map({
  caption: {
    element: 'cite',
  },
  'block-quote-caption': {
    element: 'blockquote',
  },
  todo: {
    element: 'div',
  }
}).merge(DefaultDraftBlockRenderMap);


export default RenderMap;
