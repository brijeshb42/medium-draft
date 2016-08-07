import './toolbar.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Entity } from 'draft-js';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

import { getSelection, getSelectionRect } from 'util/index';
import { getCurrentBlock } from 'model/index';
import { Entity as CEntity } from 'util/constants';

export default class Toolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showURLInput: false,
      urlInputValue: '',
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleLinkInput = this.handleLinkInput.bind(this);
    this.hideLinkInput = this.hideLinkInput.bind(this)
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
  }

  componentDidUpdate() {
    if (!this.props.editorEnabled || this.state.showURLInput) {
      return;
    }
    const selectionState = this.props.editorState.getSelection();
    if (selectionState.isCollapsed()) {
      return;
    }
    const nativeSelection = getSelection(window);
    if (!nativeSelection.rangeCount) {
      return;
    }
    const selectionBoundary = getSelectionRect(nativeSelection);

    const toolbarNode = ReactDOM.findDOMNode(this);
    const toolbarBoundary = toolbarNode.getBoundingClientRect();
    
    const parent = ReactDOM.findDOMNode(this.props.editorNode);
    const parentBoundary = parent.getBoundingClientRect();

    /*
    * Main logic for setting the toolbar position.
    */
    toolbarNode.style.top = (selectionBoundary.top - parentBoundary.top - toolbarBoundary.height - 5) + 'px';
    toolbarNode.style.width = toolbarBoundary.width + 'px';
    const widthDiff = selectionBoundary.width - toolbarBoundary.width;
    if (widthDiff >= 0) {
      toolbarNode.style.left = (widthDiff / 2) + 'px';
    } else {
      const left = (selectionBoundary.left - parentBoundary.left);
      toolbarNode.style.left = (left + widthDiff / 2) + 'px';
    }
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
      this.hideLinkInput(e);
    }
  }

  onChange (e) {
    this.setState({
      urlInputValue: e.target.value
    });
  }

  handleLinkInput(e, direct=false) {
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
    const toolbarNode = ReactDOM.findDOMNode(this);
    const toolbarBoundary = toolbarNode.getBoundingClientRect();
    toolbarNode.style.width = toolbarBoundary.width + 'px';
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let linkFound = false;
    currentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && Entity.get(entityKey).getType() === CEntity.LINK;
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

  hideLinkInput(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showURLInput: false,
      urlInputValue: '',
    }, () => this.props.focus());
  }

  render() {
    const { editorState, editorEnabled } = this.props;
    const { showURLInput, urlInputValue } = this.state;
    let isOpen = true;
    if (!editorEnabled || editorState.getSelection().isCollapsed()) {
      isOpen = false;
    }
    if (showURLInput) {
      return (
        <div className={'editor-toolbar' + (isOpen ? ' editor-toolbar--isopen' : '') + ' editor-toolbar--linkinput' }>
          <div className="RichEditor-controls RichEditor-show-link-input" style={{display: 'block'}}>
            <span className="url-input-close" onMouseDown={this.hideLinkInput}>&times;</span>
            <input
              ref="urlinput"
              type="text"
              className="url-input"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
              placeholder='Press ENTER or ESC'
              value={urlInputValue} />
          </div>
        </div>
      );
    }
    return (
      <div className={'editor-toolbar' + (isOpen ? ' editor-toolbar--isopen' : '') }>
        <BlockToolbar
          editorState={editorState}
          onToggle={this.props.toggleBlockType}
          buttons={this.props.blockButtons} />
        <InlineToolbar
          editorState={editorState}
          onToggle={this.props.toggleInlineStyle}
          buttons={this.props.inlineButtons} />
        <div className="RichEditor-controls">
          <a className="RichEditor-styleButton RichEditor-linkButton hint--top" href="#" onClick={this.handleLinkInput} aria-label="Add a link">
            #
          </a>
        </div>
      </div>
    );
  }
}

export const BLOCK_BUTTONS = [
  {
    label: 'H3',
    style: 'header-two',
    icon: 'header',
    description: 'Heading 2',
  },
  // {
  //   label: 'P',
  //   style: 'unstyled',
  //   description: 'Paragraph',
  // },
  {
    label: 'Q',
    style: 'blockquote',
    icon: 'quote-right',
    description: 'Blockquote'
  },
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: 'list-ul',
    description: 'Unordered List',
  },
  {
    label: 'OL',
    style: 'ordered-list-item',
    icon: 'list-ol',
    description: 'Ordered List',
  },
  {
    label: '✓',
    style: 'todo',
    description: 'Todo List',
  }
];

export const INLINE_BUTTONS = [
  {
    label: 'B',
    style: 'BOLD',
    icon: 'bold',
    description: 'Bold',
  },
  {
    label: 'I',
    style: 'ITALIC',
    icon: 'italic',
    description: 'Italic',
  },
  {
    label: 'U',
    style: 'UNDERLINE',
    icon: 'underline',
    description: 'Underline',
  },
  // {
  //   label: 'S',
  //   style: 'STRIKETHROUGH',
  //   icon: 'strikethrough',
  //   description: 'Strikethrough',
  // },
  {
    label: 'Hi',
    style: 'HIGHLIGHT',
    description: 'Highlight selection',
  },
  // {
  //   label: 'Code',
  //   style: 'CODE',
  //   description: 'Inline Code',
  // },
];

Toolbar.defaultProps = {
  blockButtons: BLOCK_BUTTONS,
  inlineButtons: INLINE_BUTTONS,
};
