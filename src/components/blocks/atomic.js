// import './atomic.scss';

import React from 'react';
import { Entity } from 'draft-js';

export default (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (type === 'image') {
    return (
      <div className="block-atomic-wrapper">
        <img src={data.src} />
        <div className="block-atomic-controls">
          <button>&times;</button>
        </div>
      </div>
    );
  }
  return <p>No supported block for {type}</p>;
};
