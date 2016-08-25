import React from 'react';

import { EditorBlock } from 'draft-js';

class ImageBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      // editableEnabled: false,
    };

    this.onClick = this.onClick.bind(this);
    // this.enableEditable = this.enableEditable.bind(this);
  }

  onClick(e) {
    this.setState({
      selected: !this.state.selected,
    });
  }

  focus() {
    this.setState({
      selected: true,
    });
  }

  // enableEditable(e) {
  //   this.setState({
  //     editableEnabled: true,
  //   });
  // }

  render() {
    const data = this.props.block.getData();
    // const length = this.props.block.getLength();
    const src = data.get('src');
    const className = this.state.selected ? 'is-selected' : '';
    // const showPlaceholder = length < 1 && this.state.editableEnabled === false;
    if (src !== null) {
      return (
        <div>
          <img onClick={this.onClick} className={className} src={src} />
          <figcaption>
            <EditorBlock {...this.props} />
          </figcaption>
        </div>
      );
    }
    return <EditorBlock {...this.props} />
  }
}


export default ImageBlock;
