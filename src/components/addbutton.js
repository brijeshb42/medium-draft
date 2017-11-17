import PropTypes from 'prop-types';
// import './addbutton.scss';

import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import { getSelectedBlockNode } from '../util';


/*
Implementation of the medium-link side `+` button to insert various rich blocks
like Images/Embeds/Videos.
*/
export default class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
      visible: false,
      isOpen: false,
    };
    this.node = null;
    this.blockKey = '';
    this.blockType = '';
    this.blockLength = -1;

    this.findNode = this.findNode.bind(this);
    this.hideBlock = this.hideBlock.bind(this);
    this.openToolbar = this.openToolbar.bind(this);
  }

  // To show + button only when text length == 0
  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (!selectionState.isCollapsed() || selectionState.anchorKey !== selectionState.focusKey || contentState.getBlockForKey(selectionState.getAnchorKey()).getType().indexOf('atomic') >= 0) {
      // console.log('no sel');
      this.hideBlock();
      return;
    }
    const block = contentState.getBlockForKey(selectionState.anchorKey);
    const bkey = block.getKey();
    if (block.getLength() > 0) {
      this.hideBlock();
      return;
    }
    if (block.getType() !== this.blockType) {
      this.blockType = block.getType();
      if (block.getLength() === 0) {
        setTimeout(this.findNode, 0);
      }
      this.blockKey = bkey;
      return;
    }
    if (this.blockKey === bkey) {
      // console.log('block exists');
      if (block.getLength() > 0) {
        this.hideBlock();
      } else {
        this.setState({
          visible: true,
        });
      }
      return;
    }
    this.blockKey = bkey;
    if (block.getLength() > 0) {
      // console.log('no len');
      this.hideBlock();
      return;
    }
    setTimeout(this.findNode, 0);
  }

  // Show + button regardless of block length
  // componentWillReceiveProps(newProps) {
  //   const { editorState } = newProps;
  //   const contentState = editorState.getCurrentContent();
  //   const selectionState = editorState.getSelection();
  //   if (!selectionState.isCollapsed() || selectionState.anchorKey != selectionState.focusKey) {
  //     this.hideBlock();
  //     return;
  //   }
  //   const block = contentState.getBlockForKey(selectionState.anchorKey);
  //   const bkey = block.getKey();
  //   if (block.getType() !== this.blockType) {
  //     this.blockType = block.getType();
  //     setTimeout(this.findNode, 0);
  //     return;
  //   }
  //   if (this.blockKey === bkey) {
  //     this.setState({
  //       visible: true
  //     });
  //     return;
  //   }
  //   this.blockKey = bkey;
  //   setTimeout(this.findNode, 0);
  // }

  hideBlock() {
    if (this.state.visible) {
      this.setState({
        visible: false,
        isOpen: false,
      });
    }
  }

  openToolbar() {
    this.setState({
      isOpen: !this.state.isOpen,
    }, () => { // callback function
      // save page state
      const x = window.scrollX;
      const y = window.scrollY;
      // do focus
      this.props.focus();
      // back previous window state
      window.scrollTo(x, y);
    });
  }

  findNode() {
    // eslint-disable-next-line no-undef
    const node = getSelectedBlockNode(window);
    if (node === this.node) {
      // console.log('Node exists');
      return;
    }
    if (!node) {
      // console.log('no node');
      this.setState({
        visible: false,
        isOpen: false,
      });
      return;
    }
    // const rect = node.getBoundingClientRect();
    this.node = node;
    this.setState({
      visible: true,
      style: {
        top: node.offsetTop - 3,
      },
    });
  }

  render() {
    if (!this.state.visible) {
      return null;
    }
    return (
      <div className="md-side-toolbar" style={this.state.style}>
        <button
          onClick={this.openToolbar}
          className={`md-sb-button md-add-button${this.state.isOpen ? ' md-open-button' : ''}`}
          type="button"
        >
          <svg viewBox="0 0 8 8" height="14" width="14">
            <path d="M3 0v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" />
          </svg>
        </button>
        {this.state.isOpen ? (
          <CSSTransitionGroup
            transitionName="md-example"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={100}
            transitionAppearTimeout={100}
            transitionAppear
          >
            {this.props.sideButtons.map((button) => {
              const Button = button.component;
              const extraProps = button.props ? button.props : {};
              return (
                <Button
                  key={button.title}
                  {...extraProps}
                  getEditorState={this.props.getEditorState}
                  setEditorState={this.props.setEditorState}
                  close={this.openToolbar}
                />
              );
            })}
          </CSSTransitionGroup>
        ) : null}
      </div>
    );
  }
}

AddButton.propTypes = {
  focus: PropTypes.func,
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  sideButtons: PropTypes.arrayOf(PropTypes.object),
};
