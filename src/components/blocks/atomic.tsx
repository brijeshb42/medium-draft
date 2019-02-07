import React from 'react';
import Draft from 'draft-js';

type Props = {
  block: Draft.ContentBlock;
  getEditorState: () => Draft.EditorState;
};

const AtomicBlock: React.StatelessComponent<Props> = (props: Props) => {
  const content = props.getEditorState().getCurrentContent();
  const entity = content.getEntity(props.block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  if (type === 'image') {
    return (
      <div className="md-block-atomic-wrapper">
        <img role="presentation" src={data.src} />
        <div className="md-block-atomic-controls">
          <button>&times;</button>
        </div>
      </div>
    );
  }

  return <p>No supported atomic block of type {type}.</p>;
};

export default AtomicBlock;
