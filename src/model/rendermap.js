import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';


/*
Mapping that returns containers for the various block types.
*/
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
