import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

const RenderMap = Map({
  unstyled: {
    element: 'div'
  },
  caption: {
    element: 'cite',
  },
  'block-quote-caption': {
    element: 'blockquote',
  }
}).merge(DefaultDraftBlockRenderMap);


export default RenderMap;
