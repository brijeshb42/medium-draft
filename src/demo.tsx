import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorState } from 'draft-js';
import * as Prism from 'prismjs';
import prismPlugin from 'draft-js-prism-plugin';

import 'prismjs/components/prism-python';
import 'draft-js/dist/Draft.css';
import 'prismjs/themes/prism-solarizedlight.css';
import './index.scss';
import './demo.css';

import { EditorProps } from './Editor';
import { Editor, createEditorState } from './';
import { DraftPlugin } from './plugin_editor/Editor';

type State = {
  editorState: Draft.EditorState,
};

interface Props {
  Component: new (props: EditorProps) => Editor,
};

const rootNode = document.getElementById('root');

class App extends React.Component<Props, State> {
  static defaultProps = {
    Component: Editor,
  };
  plugins: Array<DraftPlugin>;

  constructor(props: any) {
    super(props);

    this.state = {
      editorState: createEditorState(),
    };

    this.plugins = [
      prismPlugin({
        prism: Prism,
      }),
    ];
  }

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { Component: Editor } = this.props;

    return (
      <Editor
        autoFocus
        editorState={this.state.editorState}
        onChange={this.onChange}
        plugins={this.plugins}
      />
    );
  }
};

ReactDOM.render(<App />, rootNode);

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('./Editor', () => {
      const { Editor } = require('./Editor');
      ReactDOM.render(<App Component={Editor} />, rootNode);
    });
  }
}
