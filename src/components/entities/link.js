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
  // console.log(props);
  const { url } = Entity.get(props.entityKey).getData();
  return (
    <a href={ url } className="draft-link hint--bottom" data-hint={ url } target="_blank">{props.children}</a>
  );
};
