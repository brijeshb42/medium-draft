import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';


export const findLinkEntities = (contentBlock, callback, contentState) => {
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

const Link = (props) => {
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

Link.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
  contentState: PropTypes.object.isRequired,
};

export default Link;
