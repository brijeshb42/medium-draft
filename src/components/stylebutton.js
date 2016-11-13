import React, { PropTypes } from 'react';

import { HYPERLINK } from '../util/constants.js';

export default class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    if (this.props.style === HYPERLINK) {
      return null;
    }
    let className = 'md-RichEditor-styleButton';
    if (this.props.active) {
      className += ' md-RichEditor-activeButton';
    }
    className += ` md-RichEditor-styleButton-${this.props.style.toLowerCase()}`;
    return (
      <span
        className={`${className} hint--top`}
        onMouseDown={this.onToggle}
        aria-label={this.props.description}
      >
        {this.props.icon ? <i className={`fa fa-${this.props.icon}`} /> : this.props.label}
      </span>
    );
  }
}


StyleButton.propTypes = {
  onToggle: PropTypes.func,
  style: PropTypes.string,
  active: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
};
