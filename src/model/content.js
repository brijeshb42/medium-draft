import {
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js';

import Link, { findLinkEntities } from '../components/entities/link';


const defaultDecorators = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);


const createEditorState = (content = null, decorators = defaultDecorators) => {
  if (content === null) {
    return EditorState.createEmpty(decorators);
  }
  return EditorState.createWithContent(convertFromRaw(content), decorators);
};


export default createEditorState;
