import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  KeyBindingUtil,
} from 'draft-js';

import Link, { findLinkEntities } from '../components/entities/link';


const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export const createEmptyContent = () => {
  return EditorState.createEmpty(decorator);
};

export const createWithContent = (content) => {
  return EditorState.createWithContent(convertFromRaw(content), decorator);
};
