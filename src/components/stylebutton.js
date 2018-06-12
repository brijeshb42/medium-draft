/* eslint-disable jsx-a11y/no-static-element-interactions */

import PropTypes from 'prop-types';
import React from 'react';

import { HYPERLINK } from '../util/constants';

export default class StyleButton extends React.Component {
  constructor(props) {
    super(props);
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
        {this.props.icon ? (
          <i className={`fa fa-${this.props.icon}`} />
        ) : (
          this.props.label
        )}
      </span>
    );
  }
}

StyleButton.propTypes = {
  onToggle: PropTypes.func,
  style: PropTypes.string.isRequired,
  active: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.object,
  ]),
  description: PropTypes.string,
};

StyleButton.defaultProps = {
  onToggle: null,
  active: false,
  icon: null,
  label: null,
  description: null,
};
