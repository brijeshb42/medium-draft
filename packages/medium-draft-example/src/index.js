import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ImageSideButton, createEditorState } from 'medium-draft';

import 'draft-js/dist/Draft.css';
import 'medium-draft/src/index.scss';
import 'medium-draft/src/components/addbutton.scss';
import 'medium-draft/src/components/toolbar.scss';
import 'medium-draft/src/components/blocks/text.scss';
import 'medium-draft/src/components/blocks/atomic.scss';
import 'medium-draft/src/components/blocks/blockquotecaption.scss';
import 'medium-draft/src/components/blocks/caption.scss';
import 'medium-draft/src/components/blocks/todo.scss';
import 'medium-draft/src/components/blocks/image.scss';
import './index.scss';

import Editor from './editor';
import EmbedSideButton from './embedSideButton';
import SeparatorSideButton from './separatorSideButton';
import rendererFn from './rendererFn';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createEditorState(),
      editorEnabled: true,
    };

    this.sideButtons = [{
      title: 'Image',
      component: ImageSideButton,
    }, {
      title: 'Embed',
      component: EmbedSideButton,
    }, {
      title: 'Separator',
      component: SeparatorSideButton,
    }];

    this.onChange = (es, cb = null) => {
      this.setState({
        editorState: es,
      }, cb);
    };
  }

  toggleEdit = () => {
    this.setState({
      editorEnabled: !this.state.editorEnabled,
    }, () => {
      window.ga('send', 'event', 'draftjs', 'toggle-edit', this.state.editorEnabled.toString());
    });
  };

  render() {
    const { editorState, editorEnabled } = this.state;

    return (
      <div>
        <div className="editor-action">
          <button onClick={this.logData}>Log State</button>
          <button onClick={this.renderHTML}>Render HTML</button>
          <button onClick={this.toggleEdit}>Toggle Edit</button>
        </div>
        <Editor
          ref={(e) => { this._editor = e; }}
          editorEnabled={editorEnabled}
          sideButtons={this.sideButtons}
          placeholder="Write..."
          editorState={editorState}
          onChange={this.onChange}
          rendererFn={rendererFn}
        />
      </div>
    );
  }
}

if (!__PROD__) {
  // eslint-disable-next-line
  window.ga = () => console.log(arguments);
}

ReactDOM.render(<App />, window.document.getElementById('editor'));
