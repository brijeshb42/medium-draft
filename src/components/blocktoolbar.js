import React from 'react';
import { RichUtils } from 'draft-js';

import StyleButton from './stylebutton';


export default (props) => {
  const {editorState} = props;
  // const selection = editorState.getSelection();
  const blockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className="RichEditor-controls">
      {props.buttons.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
