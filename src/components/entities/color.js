import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';


export const findColorEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === Entity.COLOR
      );
    },
    callback
  );
};

const Color = (props) => {
  const { contentState, entityKey } = props;
  const { textColor, backgroundColor } = contentState.getEntity(entityKey).getData();
  const extraProps = {
    style: {},
    className: 'md-entity-color',
  };

  if (textColor) {
    extraProps.style.color = textColor;
    extraProps['data-text-color'] = textColor;
  }

  if (backgroundColor) {
    extraProps.style.backgroundColor = backgroundColor;
    extraProps['data-background-color'] = backgroundColor;
  }

  return (
    <span {...extraProps}>
      {props.children}
    </span>
  );
};

Color.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
  contentState: PropTypes.object.isRequired,
};

export default Color;
