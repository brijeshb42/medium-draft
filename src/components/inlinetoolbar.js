import PropTypes from 'prop-types';
import React from 'react';

import StyleButton from './stylebutton';

const InlineToolbar = (props) => {
  if (props.buttons.length < 1) {
    return null;
  }
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-inline">
      {props.buttons.map((type) => {
        const iconLabel = {};
        iconLabel.label = type.label;
        return (
          <StyleButton
            {...iconLabel}
            key={type.style}
            active={currentStyle.has(type.style)}
            onToggle={props.onToggle}
            style={type.style}
            description={type.description}
          />
        );
      })}
    </div>
  );
};

InlineToolbar.propTypes = {
  buttons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  editorState: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onToggle: PropTypes.func,
};

InlineToolbar.defaultProps = {
  buttons: [],
  onToggle: null,
};

export default InlineToolbar;
