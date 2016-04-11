import React from 'react';
import { Entity } from 'draft-js';


export const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

export default (props) => {
  const { url } = Entity.get(props.entityKey).getData();
  return (
    <a className="draft-link hint--bottom" href={url} target="_blank">{props.children}</a>
  );
};
