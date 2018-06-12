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
  buttons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  editorState: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onToggle: PropTypes.func,
};

BlockToolbar.defaultProps = {
  buttons: [],
  onToggle: null,
};

export default BlockToolbar;
