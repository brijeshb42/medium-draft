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

import BlockToolbar from 'components/blocktoolbar';
import InlineToolbar from 'components/inlinetoolbar';
import AddButton from 'components/addbutton';

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
    case 'unstyled': return 'block block-paragraph';
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
    this.onKeyDown = this.onKeyDown.bind(this);
    this.showLinkInput = this.showLinkInput.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.loadSavedData = this.loadSavedData.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
  }

  componentDidMount() {
    this.refs.editor.focus();
    // console.log(this.refs.editor);
    // setInterval(() => {
    //   const s = getSelection();
    //   console.log(s);
    //   console.log(getSelectionRect(s));
    // }, 5000);
  }

  onChange(editorState) {
    // console.log(editorState.getSelection().toJS());
    this.setState({editorState});
  }

  onClick(e) {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log(this.state.editorState.getSelection().toJS());
    window.sel = this.state.editorState.getSelection();
  }

  onKeyDown(e) {
    if (e.which === 13 && e.target.value !== '') {
      const { editorState } = this.state;
      const selection = editorState.getSelection();
      const entityKey = Entity.create('LINK', 'MUTABLE', {href: e.target.value});
      this.setState({
        editorState: RichUtils.toggleLink(
          editorState,
          selection,
          entityKey
        ),
        showURLInput: false,
        urlValue: '',
      }, () => {
        setTimeout(() => this.refs.editor.focus(), 0);
      });
    }
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
    // console.log(str);
    const block = getCurrentBlock(this.state.editorState);
    if (block.getType() === 'blockquote' && (block.text + str) == '--') {
      this.toggleBlockType('block-quote-caption');
      return true;
    }
    if (block.getType() !== 'unstyled') {
      return false;
    }
    if ((block.text + str) == '* ') {
      this.toggleBlockType('unordered-list-item');
      return true;
    } else if ((block.text + str) == '1.') {
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

  showLinkInput(e) {
    e.preventDefault();
    e.stopPropagation();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.refs.editor.focus();
      return;
    }
    this.setState({
      showURLInput: true
    }, () => {
      this.refs.urlinput.focus();
    });
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

  changeUrl(e) {
    this.setState({
      urlValue: e.target.value
    });
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
        { editorEnabled ? <BlockToolbar
                          editorState={editorState}
                          onToggle={this.toggleBlockType}
                          buttons={BLOCK_BUTTONS} /> : null}
        { editorEnabled ? <InlineToolbar
                          editorState={editorState}
                          onToggle={this.toggleInlineStyle}
                          buttons={INLINE_BUTTONS} /> : null}
        { editorEnabled ? (showURLInput ? <input
                          ref="urlinput"
                          type="text"
                          onKeyDown={this.onKeyDown}
                          onChange={this.changeUrl}
                          value={urlValue} /> : <a href="#1" onClick={this.showLinkInput}>#</a>) : null}
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

const BLOCK_BUTTONS = [
  // {label: 'H2', style: 'header-two'},
  {label: 'Heading', style: 'header-three'},
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

setTimeout(() => {
  ReactDOM.render(
    <MyEditor />,
    document.getElementById('app')
  );
}, 100);
