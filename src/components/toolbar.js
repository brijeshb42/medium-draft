import './toolbar.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Entity } from 'draft-js';

import { getVisibleSelectionRect } from 'draft-js';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

import { getSelection, getSelectionRect } from 'util/index';
import { getCurrentBlock } from 'model/index';

window.getVisibleSelectionRect = getVisibleSelectionRect;

export default class Toolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showURLInput: false,
      urlInputValue: '',
      style: {
        top: 0,
        left: 0
      }
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showLinkInput = this.showLinkInput.bind(this);

    this.hasDimension = false;
    this.rect = {};
    this.forceHide = false;
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    if (!newProps.editorEnabled) {
      return;
    }
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) {
      if (this.state.showURLInput) {
        this.setState({
          showURLInput: false
        });
      }
      return;
    }
    const nativeSelection = getSelection(window);
    if (!nativeSelection.rangeCount) {
      return;
    }
    const node = nativeSelection.getRangeAt(0).startContainer.parentNode;
    const rect = getSelectionRect(nativeSelection);
    if (this.hasDimension) {
      let left = rect.left - this.rect.width;
      if (rect.width >= this.rect.width) {
        left = (rect.width - this.rect.width) / 2;
      }
      this.setState({
        style: {
          top: rect.top - this.rect.height - 50,
          width: this.rect.width,
          left
        }
      });
    } else {
      this.setState({
        style: {
          top: rect.top - 100,
          left: (rect.left + rect.width - 341) / 2,
          width: 341
        }
      });
    }
  }

  componentDidUpdate() {
    this.forceHide = false;
    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return;
    }
    this.rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.hasDimension = true;
  }

  onKeyDown(e) {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setLink(this.state.urlInputValue);
      this.setState({
        showURLInput: false,
        urlInputValue: '',
      }, () => this.props.focus());
    } else if (e.which === 27) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        showURLInput: false,
        urlInputValue: '',
      }, () => this.props.focus());
    }
  }

  onChange (e) {
    this.setState({
      urlInputValue: e.target.value
    });
  }

  showLinkInput(e, direct=false) {
    if (!direct) {
      e.preventDefault();
      e.stopPropagation();   
    }
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.props.focus();
      return;
    }
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let linkFound = false;
    currentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && Entity.get(entityKey).getType() === 'LINK';
    }, (start, end) => {
      let selStart = selection.getAnchorOffset();
      let selEnd = selection.getFocusOffset();
      if (selection.getIsBackward()) {
        selStart = selection.getFocusOffset();
        selEnd = selection.getAnchorOffset();
      }
      if (start == selStart && end == selEnd) {
        linkFound = true;
        const { url } = Entity.get(selectedEntity).getData();
        this.setState({
          showURLInput: true,
          urlInputValue: url
        }, () => {
          setTimeout(() => {
            this.refs.urlinput.focus();
            this.refs.urlinput.select();
          }, 0);
        });
      }
      // console.log(start, end);
      // console.log(selection.toJS());
    });
    if (!linkFound) {
      this.setState({
        showURLInput: true
      }, () => {
        setTimeout(() => {
          this.refs.urlinput.focus();
        }, 0);
      });
    }
  }

  render() {
    const { editorState, editorEnabled } = this.props;
    const { showURLInput, urlInputValue, style } = this.state;
    if (!editorEnabled || editorState.getSelection().isCollapsed()) {
      return null;
    }
    return (
      <div className="editor-toolbar" style={style}>
        {!showURLInput ? <BlockToolbar
          editorState={editorState}
          onToggle={this.props.toggleBlockType}
          buttons={BLOCK_BUTTONS} /> : null}
        {!showURLInput ? <InlineToolbar
          editorState={editorState}
          onToggle={this.props.toggleInlineStyle}
          buttons={INLINE_BUTTONS} /> : null}
        <div className="RichEditor-controls" style={showURLInput ? {display: 'block'} : {}}>
        {showURLInput ? <input
          ref="urlinput"
          type="text"
          className="url-input"
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          placeholder='Press ENTER or ESC'
          value={urlInputValue} /> : <a className="RichEditor-linkButton" href="#" onClick={this.showLinkInput}>#</a>}
        </div>
      </div>
    );
  }
}

const BLOCK_BUTTONS = [
  // {label: 'H1', style: 'header-one'},
  // {label: 'H2', style: 'header-two'},
  {label: 'T', style: 'header-three'},
  {label: 'N', style: 'unstyled'},
  {label: 'Q', style: 'blockquote'},
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
