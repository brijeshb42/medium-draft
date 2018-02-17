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

InlineToolbar.defaultProps = {
  buttons: [],
};

export default InlineToolbar;
