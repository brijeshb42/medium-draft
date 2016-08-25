import 'draft-js/dist/Draft.css';
import 'hint.css/src/hint.scss';
import './index.scss';
import './components/addbutton.scss';
import './components/toolbar.scss';
import './components/blocks/text.scss';
import './components/blocks/atomic.scss';
import './components/blocks/blockquotecaption.scss';
import './components/blocks/caption.scss';
import './components/blocks/todo.scss';
import './components/blocks/image.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  KeyBindingUtil,
} from 'draft-js';

import {
  Editor,
  StringToTypeMap,
  Block,
  Link,
  findLinkEntities,
  keyBindingFn,
} from './index';


const newTypeMap = StringToTypeMap;
newTypeMap['2.'] = Block.OL

const { hasCommandModifier } = KeyBindingUtil;


class App extends React.Component {
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
      editorEnabled: true,
      placeholder: 'Write your story...'
    };

    this.onChange = (editorState, callback = null) => {
      if (this.state.editorEnabled) {
        this.setState({ editorState }, () => {
          if (callback) {
            callback();
          }
        });
      }
    };

    this.logData = this.logData.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.loadSavedData = this.loadSavedData.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
    this.keyBinding = this.keyBinding.bind(this);
  }

  componentDidMount() {
    this.setState({
      placeholder: 'Loading content...',
    });
    setTimeout(this.fetchData, 1000);
    // this.fetchData();
  }

  keyBinding(e) {
    if(hasCommandModifier(e)) {
      if (e.which == 83) {  /* Key S */
        return 'editor-save';
      } else if (e.which == 74 /* Key J */) {
        return 'do-nothing';
      }
    }
    if (e.altKey === true) {
      if (e.shiftKey === true) {
        switch(e.which) {
          /* Alt + Shift + L */
          case 76: return 'load-saved-data';
          /* Key E */
          // case 69: return 'toggle-edit-mode';
        }
      }
      if (e.which === 72 /* Key H */) {
        return 'toggleinline:HIGHLIGHT';
      }
    }
    return keyBindingFn(e);
  }

  handleKeyCommand(command) {
    if (command === 'editor-save') {
      window.localStorage['editor'] = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
      window.ga('send', 'event', 'draftjs', command);
      return true;
    } else if (command === 'load-saved-data') {
      this.loadSavedData();
      return true;
    } else if (command === 'toggle-edit-mode') {
      this.toggleEdit();
    }
    return false;
  }

  fetchData() {
    window.ga('send', 'event', 'draftjs', 'load-data', 'ajax');
    const req = new XMLHttpRequest();
    req.open('GET', 'data.json', true);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const data = JSON.parse(req.responseText);
        this.setState({
          editorState: EditorState.push(this.state.editorState, convertFromRaw(data)),
          placeholder: 'Write your story...'
        }, () => {
          this.refs.editor.focus();
        });
        window.ga('send', 'event', 'draftjs', 'data-success');
      }
    };
    req.send();
  }

  logData(e) {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log(this.state.editorState.getSelection().toJS());
    window.ga('send', 'event', 'draftjs', 'log-data');
  }

  loadSavedData() {
    const data = window.localStorage.getItem('editor');
    if (data === null) {
      return;
    }
    try {
      const blockData = JSON.parse(data);
      console.log(blockData);
      this.onChange( EditorState.push(this.state.editorState, convertFromRaw(blockData)), this.refs.editor.focus);
    } catch(e) {
      console.log(e);
    }
    window.ga('send', 'event', 'draftjs', 'load-data', 'localstorage');
  }

  toggleEdit(e) {
    this.setState({
      editorEnabled: !this.state.editorEnabled
    }, () => {
      window.ga('send', 'event', 'draftjs', 'toggle-edit', this.state.editorEnabled + '');
    });
  }

  handleDroppedFiles(selection, files) {
    console.log(files);
    console.log(selection);
    window.ga('send', 'event', 'draftjs', 'filesdropped', files.length + ' files');
  }

  render() {
    const { editorState, editorEnabled } = this.state;
    return (
      <div>
        <Editor
          ref="editor"
          editorState={editorState}
          onChange={this.onChange}
          editorEnabled={editorEnabled}
          handleDroppedFiles={this.handleDroppedFiles}
          handleKeyCommand={this.handleKeyCommand}
          placeholder={this.state.placeholder}
          keyBindingFn={this.keyBinding}
        />
        <div className="editor-action">
          <button onClick={this.logData}>Log State</button>
          <button onClick={this.toggleEdit}>Toggle Edit</button>
        </div>
      </div>
    );
  }
};

// if (__DEV__) {
  window.ga = function() {
    console.log(arguments);
  };
// }
ReactDOM.render(
  <App />,
  document.getElementById('app')
);
