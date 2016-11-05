import React, { PropTypes } from 'react';

import { EditorBlock } from 'draft-js';

import { getCurrentBlock } from '../../model/';

const ImageBlock = (props) => {
  const { block, blockProps } = props;
  const { getEditorState } = blockProps;
  const data = block.getData();
  const src = data.get('src');
  const currentBlock = getCurrentBlock(getEditorState());
  const className = currentBlock.getKey() === block.getKey() ? 'md-image-is-selected' : '';
  if (src !== null) {
    return (
      <div>
        <div className="md-block-image-inner-container">
          <img role="presentation" className={className} src={src} />
        </div>
        <figcaption>
          <EditorBlock {...props} />
        </figcaption>
      </div>
    );
  }
  return <EditorBlock {...props} />;
};

ImageBlock.propTypes = {
  block: PropTypes.object,
  blockProps: PropTypes.object,
};


export default ImageBlock;
