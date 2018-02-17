import PropTypes from 'prop-types';
import React from 'react';
import { RichUtils } from 'draft-js';

import StyleButton from './stylebutton';


const BlockToolbar = (props) => {
  if (props.buttons.length < 1) {
    return null;
  }
  const { editorState } = props;
  const blockType = RichUtils.getCurrentBlockType(editorState);
  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-block">
      {props.buttons.map((type) => {
        const iconLabel = {};
        iconLabel.label = type.label;
        return (
          <StyleButton
            {...iconLabel}
            key={type.style}
            active={type.style === blockType}
            onToggle={props.onToggle}
            style={type.style}
            description={type.description}
          />
        );
      })}
    </div>
  );
};

BlockToolbar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    style: PropTypes.string.isRequired,
    icon: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.object,
    ]),
    description: PropTypes.string,
  })),
  // eslint-disable-next-line
  editorState: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
};

BlockToolbar.defaultProps = {
  buttons: [],
};

export default BlockToolbar;
