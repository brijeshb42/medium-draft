import * as React from 'react';
import { EditorBlock } from 'draft-js';

import { updateDataOfBlock } from '../../model/';

type Props = {
  block: Draft.ContentBlock;
  blockProps: {
    getEditorState: () => Draft.EditorState;
    setEditorState: (es: Draft.EditorState) => void;
  };
};


export default class TodoBlock extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateData = this.updateData.bind(this);
  }

  updateData() {
    const { block, blockProps } = this.props;
    const { setEditorState, getEditorState } = blockProps;
    const data = block.getData();
    const checked = (data.has('checked') && data.get('checked') === true);
    const newData = data.set('checked', !checked);
    setEditorState(updateDataOfBlock(getEditorState(), block, newData));
  }

  render() {
    const data = this.props.block.getData();
    const checked = data.get('checked') === true;
    return (
      <div className={checked ? 'block-todo-completed' : ''}>
        <span contentEditable={false}>
          <input type="checkbox" checked={checked} onChange={this.updateData} />
        </span>
        <EditorBlock {...this.props} />
      </div>
    );
  }
}
