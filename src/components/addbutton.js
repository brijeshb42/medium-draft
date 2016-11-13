// import './addbutton.scss';

import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
    if (!selectionState.isCollapsed() || selectionState.anchorKey !== selectionState.focusKey) {
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
    }, this.props.focus);
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
    if (this.state.visible) {
      return (
        <div className="md-side-toolbar" style={this.state.style}>
          <button
            onClick={this.openToolbar}
            className={`md-sb-button md-add-button${this.state.isOpen ? ' md-open-button' : ''}`}
            type="button"
          >
            <i className="fa fa-plus-circle fa-lg" />
          </button>
          {this.state.isOpen ? (
            <ReactCSSTransitionGroup
              transitionName="md-example"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={100}
              transitionAppear
              transitionAppearTimeout={100}
            >
              {this.props.sideButtons.map((button) => {
                const Button = button.component;
                return (
                  <Button
                    key={button.title}
                    getEditorState={this.props.getEditorState}
                    setEditorState={this.props.setEditorState}
                    close={this.openToolbar}
                  />
                );
              })}
            </ReactCSSTransitionGroup>
          ) : null}
        </div>
      );
    }
    return null;
  }
}

AddButton.propTypes = {
  focus: PropTypes.func,
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  sideButtons: PropTypes.arrayOf(PropTypes.object),
};
