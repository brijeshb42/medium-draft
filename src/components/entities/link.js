import React, { PropTypes } from 'react';
import { Entity } from 'draft-js';

import { Entity as E } from '../../util/constants';


export const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === E.LINK
      );
    },
    callback
  );
};

const Link = (props) => {
  props.children.bar();
  const { url } = Entity.get(props.entityKey).getData();
  return (
    <a
      className="md-link hint--top hint--rounded"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >{props.children}</a>
  );
};

Link.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
};

export default Link;
