import 'draft-js/dist/Draft.css';
import './index.scss';
// import './hint.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Editor,
  EditorState,
  SelectionState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  Entity,
} from 'draft-js';

import AddButton from 'components/addbutton';
import Toolbar from 'components/toolbar';

import rendererFn from 'components/customrenderer';
import { getSelectionRect, getSelection } from 'util';
import keyBindingFn from 'util/keybinding';
import { getCurrentBlock } from 'util';
import Link, { findLinkEntities } from 'components/entities/link';

const styleMap = {
   'HIGHLIGHT': {
      backgroundColor: 'yellow',
   },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'block block-quote RichEditor-blockquote';
    default: return null;
  }
}

class MyEditor extends React.Component {

  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);
    this.state = {
      editorState: EditorState.createEmpty(decorator),
      showURLInput: false,
      editorEnabled: true,
      urlValue: ''
    };
    this.focus = () => this.refs.editor.focus();

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.loadSavedData = this.loadSavedData.bind(this);
    this.setLink = this.setLink.bind(this);
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  onChange(editorState) {
    this.setState({editorState});
  }

  onClick(e) {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log(this.state.editorState.getSelection().toJS());
    window.sel = this.state.editorState.getSelection();
  }

  setLink(url) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    const entityKey = Entity.create('LINK', 'MUTABLE', {href: url});
    this.setState({
      editorState: RichUtils.toggleLink(
        editorState,
        selection,
        entityKey
      ),
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  handleKeyCommand(command) {
    if (command === 'editor-save') {
      window.localStorage['editor'] = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
      return true;
    }
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  handleBeforeInput(str) {
    const block = getCurrentBlock(this.state.editorState);
    const blockType = block.getType();
    if ((block.text[0] + str) == '--') {
      if (blockType === 'blockquote') {
        this.toggleBlockType('block-quote-caption');
      } else {
        this.toggleBlockType('caption');
      }
      return true;
    }
    if (block.getType() !== 'unstyled') {
      return false;      
    }
    if ((block.text[0] + str) == '* ') {
      this.toggleBlockType('unordered-list-item');
      return true;
    } else if ((block.text[0] + str) == '1.') {
      this.toggleBlockType('ordered-list-item');
      return true;
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  toggleEdit(e) {
    this.setState({
      editorEnabled: !this.state.editorEnabled
    });
  }

  loadSavedData() {
    const data = window.localStorage.getItem('editor');
    if (data === null) {
      console.log('No data found.');
      return;
    }
    try {
      const blockData = JSON.parse(data);
      console.log(blockData);
      this.setState({
        editorState: EditorState.push(
          this.state.editorState,
          ContentState.createFromBlockArray(convertFromRaw(blockData))
        )
      }, () => this.refs.editor.focus());
    } catch(e) {
      console.log(e);
      console.log('Could not load data.');
    }
  }

  render() {
    const { editorState, showURLInput, editorEnabled, urlValue } = this.state;
    return (
      <div className="RichEditor-root">
        <div className="editor-action">
          <button onClick={this.onClick}>State</button>
          <button onClick={this.toggleEdit}>Toggle Edit</button>
          <button onClick={this.loadSavedData}>Load local data.</button>
        </div>
        <Toolbar
          editorState={editorState}
          toggleBlockType={this.toggleBlockType}
          toggleInlineStyle={this.toggleInlineStyle}
          editorEnabled={editorEnabled}
          setLink={this.setLink}
          focus={this.focus} />
        <div className="RichEditor-editor">
          <Editor
            ref="editor"
            blockRendererFn={rendererFn}
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            customStyleMap={styleMap}
            readOnly={!editorEnabled}
            keyBindingFn={keyBindingFn}
            handleBeforeInput={this.handleBeforeInput}
            spellCheck={false} />
          { editorEnabled ? <AddButton editorState={editorState} /> : null }
        </div>
      </div>
    );
  }
}

setTimeout(() => {
  ReactDOM.render(
    <MyEditor />,
    document.getElementById('app')
  );
}, 100);
