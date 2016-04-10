import './toolbar.scss';

import React from 'react';

import { getVisibleSelectionRect } from 'draft-js';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

window.getVisibleSelectionRect = getVisibleSelectionRect;

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
      }, () => this.props.focus());
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
      this.props.focus();
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
        {!showURLInput ? <BlockToolbar
          editorState={editorState}
          onToggle={this.props.toggleBlockType}
          buttons={BLOCK_BUTTONS} /> : null}
        {!showURLInput ? <InlineToolbar
          editorState={editorState}
          onToggle={this.props.toggleInlineStyle}
          buttons={INLINE_BUTTONS} /> : null}
        <div className="RichEditor-controls">
        {showURLInput ? <input
          ref="urlinput"
          type="text"
          className="url-input"
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={urlInputValue} /> : <a className="RichEditor-linkButton" href="#" onClick={this.showLinkInput}>#</a>}
        </div>
      </div>
    );
  }
}

const BLOCK_BUTTONS = [
  {label: 'Title', style: 'header-three'},
  {label: 'Normal', style: 'unstyled'},
  {label: 'Quote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
];

const INLINE_BUTTONS = [
  {label: <b>B</b>, style: 'BOLD'},
  {label: <i>I</i>, style: 'ITALIC'},
  {label: <u>U</u>, style: 'UNDERLINE'},
  {label: <strike>S</strike>, style: 'STRIKETHROUGH'},
  {label: 'Hi', style: 'HIGHLIGHT'},
];
