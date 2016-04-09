import './addbutton.scss';

import React from 'react';

import { getVisibleSelectionRect } from 'draft-js';

import { getSelectionRect, getSelection, getSelectedBlockNode } from 'util';

export default class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
      visible: false,
    };
    this.node = null;
    this.blockKey = '';
    this.blockType = '';
    this.blockLength = -1;

    this.findNode = this.findNode.bind(this);
    this.hideBlock = this.hideBlock.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (!selectionState.isCollapsed() || selectionState.anchorKey != selectionState.focusKey) {
      console.log('no sel');
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
      if (block.getLength() == 0) {
        setTimeout(this.findNode, 0);
      }
      return;
    }
    if (this.blockKey === bkey) {
      console.log('block exists');
      if (block.getLength() > 0) {
        this.hideBlock();
      } else {
        this.setState({
          visible: true
        });
      }
      return;
    }
    this.blockKey = bkey;
    if (block.getLength() > 0) {
      console.log('no len');
      this.hideBlock();
      return;
    }
    setTimeout(this.findNode, 0);
  }

  hideBlock() {
    if (this.state.visible) {
      this.setState({
        visible: false
      });
    }
  }

  findNode() {
    const node = getSelectedBlockNode(window);
    window.nod = node;
    if (node === this.node) {
      console.log('Node exists');
      return;
    }
    if (!node) {
      console.log('no node');
      this.setState({
        visible: false
      });
      return;
    }
    const rect = node.getBoundingClientRect();
    this.node = node;
    this.setState({
      visible: true,
      style: {
        position: 'absolute',
        left: - 27,
        top: node.offsetTop
      }
    });
  }

  render() {
    if (this.state.visible) {
      return <button className="add-button" style={this.state.style}>+</button>;
    }
    return null;
  }
};
