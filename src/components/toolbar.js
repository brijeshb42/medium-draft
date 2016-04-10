import React from 'react';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

export default class Toolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showURLInput: false,
      urlInputValue: '',
      style: {}
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showLinkInput = this.showLinkInput.bind(this);
  }

  onKeyDown(e) {
    if (e.which === 13 && e.target.value !== '') {
      if (this.props.setLink) {
        this.props.setLink(this.state.urlInputValue);
        this.setState({
          showURLInput: false,
          urlInputValue: ''
        });
      }
    } else if (e.which === 27) {
      this.setState({
        showURLInput: false,
        urlInputValue: ''
      });
    }
  }

  onChange (e) {
    this.setState({
      urlInputValue: e.target.value
    });
  }

  showLinkInput(e) {
    e.preventDefault();
    e.stopPropagation();
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    this.setState({
      showURLInput: true
    }, () => {
      this.refs.urlinput.focus();
    });
  }

  render() {
    const { editorState, editorEnabled } = this.props;
    const { showURLInput, urlInputValue } = this.state;
    if (!editorEnabled) {
      return null;
    }
    return (
      <div className="editor-toolbar">
        <BlockToolbar
          editorState={editorState}
          onToggle={this.props.toggleBlockType}
          buttons={BLOCK_BUTTONS} />
        <InlineToolbar
          editorState={editorState}
          onToggle={this.props.toggleInlineStyle}
          buttons={INLINE_BUTTONS} />
        {showURLInput ? <input
          ref="urlinput"
          type="text"
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={urlInputValue} /> : <a href="#1" onClick={this.showLinkInput}>#</a>}
      </div>
    );
  }
}

const BLOCK_BUTTONS = [
  {label: 'Text', style: 'unstyled'},
  {label: 'H', style: 'header-three'},
  {label: 'Quote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
];

const INLINE_BUTTONS = [
  {label: <b>B</b>, style: 'BOLD'},
  {label: <i>I</i>, style: 'ITALIC'},
  {label: <u>U</u>, style: 'UNDERLINE'},
  {label: <strike>S</strike>, style: 'STRIKETHROUGH'},
  {label: <span style={{backgroundColor: 'yellow'}}>H</span>, style: 'HIGHLIGHT'},
];
