import React from 'react';

import StyleButton from './stylebutton';


export default (props) => {
  if (props.buttons.length < 1) {
    return null;
  }
  let currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {props.buttons.map(type => {
        const iconLabel = {};
        iconLabel.label = type.label;
        // if (type.icon) {
        //   iconLabel.icon = type.icon;
        // } else {
        //   iconLabel.label = type.label;
        // }
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
