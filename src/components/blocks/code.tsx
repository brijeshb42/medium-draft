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


export default class CodeBlock extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleLanguage = () => {
    const { block, blockProps } = this.props;
    const data = block.getData();
    const lang = prompt('Set Language:', data.get('language') || '');

    if (!lang) {
      return;
    }

    const { setEditorState, getEditorState } = blockProps;
    const newData = data.set('language', lang);
    setEditorState(updateDataOfBlock(getEditorState(), block, newData));
  };

  render() {
    const { block } = this.props;
    const lang = block.getData().get('language', '');

    return (
      <div className="md-block-code-wrapper" data-language={lang}>
        {/* <span contentEditable={false}>
          <button onClick={this.handleLanguage}>L</button>
        </span> */}
        <EditorBlock {...this.props} />
      </div>
    );
  }
}
