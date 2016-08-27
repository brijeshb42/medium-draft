import {
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js';

import Link, { findLinkEntities } from '../components/entities/link';


const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export const createEmptyContent = () => EditorState.createEmpty(decorator);

export const createWithContent = (content) =>
  EditorState.createWithContent(convertFromRaw(content), decorator);
