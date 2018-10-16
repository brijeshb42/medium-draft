import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorState } from 'draft-js';

import 'draft-js/dist/Draft.css';
// import 'prismjs/themes/prism-solarizedlight.css';
import './index.scss';
import './demo.css';

import { Editor, EditorStateFunctions } from './';

type State = {
  editorState: Draft.EditorState,
};

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      editorState: EditorStateFunctions.createEditorState(),
    };
  }

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
      <Editor
        autoFocus
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
