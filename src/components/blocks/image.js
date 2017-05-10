import PropTypes from 'prop-types';
import React from 'react';

import { EditorBlock, EditorState, SelectionState } from 'draft-js';

import { getCurrentBlock } from '../../model/';

class ImageBlock extends React.Component {

  static propTypes = {
    block: PropTypes.object,
    blockProps: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  focusBlock = (e) => {
    const { block, blockProps } = this.props;
    const { getEditorState, setEditorState } = blockProps;
    const key = block.getKey();
    const editorState = getEditorState();
    const currentblock = getCurrentBlock(editorState);
    if (currentblock.getKey() === key) {
      return;
    }
    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: 0,
      focusOffset: 0,
    });
    setEditorState(EditorState.forceSelection(editorState, newSelection));
  };

  render() {
    const { block, blockProps } = this.props;
    const { getEditorState } = blockProps;
    const data = block.getData();
    const src = data.get('src');
    if (src !== null) {
      return (
        <div>
          <div className="md-block-image-inner-container" onClick={this.focusBlock}>
            <img role="presentation" src={src} />
          </div>
          <figcaption>
            <EditorBlock {...this.props} />
          </figcaption>
        </div>
      );
    }
    return <EditorBlock {...this.props} />;
  }
}

export default ImageBlock;
