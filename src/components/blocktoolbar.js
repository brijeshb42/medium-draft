import React, { PropTypes } from 'react';
import { RichUtils } from 'draft-js';

import StyleButton from './stylebutton';


const BlockToolbar = (props) => {
  if (props.buttons.length < 1) {
    return null;
  }
  const { editorState } = props;
  // const selection = editorState.getSelection();
  const blockType = RichUtils.getCurrentBlockType(editorState);
  return (
    <div className="md-RichEditor-controls">
      {props.buttons.map((type) => {
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
  buttons: PropTypes.array,
  editorState: PropTypes.object.isRequired,
  onToggle: PropTypes.func,
};

export default BlockToolbar;
