import React from 'react';

import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';

export default class ImageButton extends React.Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick(e) {
    this.refs.input.value = null;
    this.refs.input.click();
  }

  onChange(e) {
    // e.preventDefault();
    const file = e.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      // console.log(this.props.getEditorState());
      const src = URL.createObjectURL(file);
      this.props.setEditorState(addNewBlock(
        this.props.getEditorState(),
        Block.IMAGE, {
          src,
        }
      ));
    }
    this.props.close();
  }

  render() {
    return (
      <button className="md-sb-button md-sb-img-button" onClick={this.onClick}>
        <i className="fa fa-image" />
        <input type="file" ref="input" onChange={this.onChange} style={{display: 'none'}} />
      </button>
    );
  }
}
