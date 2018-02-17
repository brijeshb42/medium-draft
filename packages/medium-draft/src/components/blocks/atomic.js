import PropTypes from 'prop-types';
// import './atomic.scss';

import React from 'react';

const AtomicBlock = (props) => {
  const content = props.getEditorState().getCurrentContent();
  const entity = content.getEntity(props.block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (type === 'image') {
    return (
      <div className="md-block-atomic-wrapper" role="presentation">
        <img alt={data.src} src={data.src} />
        <div className="md-block-atomic-controls">
          <button>&times;</button>
        </div>
      </div>
    );
  }
  return <p>No supported block for {type}</p>;
};

AtomicBlock.propTypes = {
  /* eslint-disable */
  block: PropTypes.object,
  /* eslint-enable */
  getEditorState: PropTypes.func.isRequired,
};

export default AtomicBlock;
