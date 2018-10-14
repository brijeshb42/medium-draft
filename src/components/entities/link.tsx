import * as Draft from 'draft-js';
import * as React from 'react';

import { Entity } from '../../util/constants';


export const findLinkEntities = (contentBlock: Draft.ContentBlock, callback: (start: number, end: number) => void, contentState: Draft.ContentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === Entity.LINK
      );
    },
    callback
  );
};

type Props = {
  contentState: Draft.ContentState,
  entityKey: string,
  children: React.ReactNode,
};

const Link = (props: Props) => {
  const { contentState, entityKey } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      className="md-link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >{props.children}</a>
  );
};

export default Link;
