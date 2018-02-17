import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getScript = () => {
  const script = window.document.createElement('script');
  script.async = 1;
  script.src = '//cdn.embedly.com/widgets/platform.js';
  script.onload = () => {
    window.embedly();
  };
  window.document.body.appendChild(script);
};

const renderEmbedly = () => {
  if (window.embedly) {
    window.embedly();
  } else {
    getScript();
  }
};

export default class AtomicEmbedComponent extends Component {
  static propTypes = {
    data: PropTypes.shape({
      url: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      showIframe: false,
    };

    this.enablePreview = this.enablePreview.bind(this);
  }

  componentDidMount() {
    renderEmbedly();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showIframe !== this.state.showIframe && this.state.showIframe === true) {
      renderEmbedly();
    }
  }

  enablePreview() {
    this.setState({
      showIframe: true,
    });
  }

  render() {
    const { url } = this.props.data;
    const innerHTML = `<div><a class="embedly-card" href="${url}" data-card-controls="0" data-card-theme="dark">Embedded ― ${url}</a></div>`;
    return (
      <div className="md-block-atomic-embed">
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      </div>
    );
  }
}
