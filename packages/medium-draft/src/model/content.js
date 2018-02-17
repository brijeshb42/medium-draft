import {
  EditorState,
  convertFromRaw,
  CompositeDecorator,
  ContentState,
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
  let contentState = null;
  if (typeof content === 'string') {
    contentState = ContentState.createFromText(content);
  } else {
    contentState = convertFromRaw(content);
  }
  return EditorState.createWithContent(contentState, decorators);
};

export default createEditorState;
