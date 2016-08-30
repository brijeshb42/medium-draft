import React, { PropTypes } from 'react';

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

  onClick() {
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
          <div className="block-image-inner-container">
            <img role="presentation" onClick={this.onClick} className={className} src={src} />
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

ImageBlock.propTypes = {
  block: PropTypes.object,
};


export default ImageBlock;

/*

<div
              className="block-image-toolbar-container"
              style={{ display: (this.state.selected ? 'block' : 'none') }}
            >
              <i className="fa fa-lg fa-trash" title="Remove image" />
            </div>*/
