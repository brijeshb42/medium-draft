import PropTypes from 'prop-types';
import React from 'react';

import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';

export default class BreakButton extends React.Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.setEditorState(addNewBlock(
      this.props.getEditorState(),
      Block.BREAK
    ));
  }

  render() {
    return (
      <button className="md-sb-button" onClick={this.onClick} type="button">
        <i className="fa fa-minus" />
      </button>
    );
  }
}

BreakButton.propTypes = {
  setEditorState: PropTypes.func,
  getEditorState: PropTypes.func,
  close: PropTypes.func,
};
