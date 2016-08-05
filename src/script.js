import React from 'react';
import ReactDOM from 'react-dom';
import { EditorState, convertToRaw, convertFromRaw, CompositeDecorator } from 'draft-js';

import { Editor, StringToTypeMap, Block, Link, findLinkEntities } from './index';
// import data from 'json!data.json';


const newTypeMap = StringToTypeMap;
newTypeMap['2.'] = Block.OL

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
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const req = new XMLHttpRequest();
    req.open('GET', '/data.json', true);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const data = JSON.parse(req.responseText);
        this.setState({
          editorState: EditorState.push(this.state.editorState, convertFromRaw(data))
        });
      }
    };
    req.send();
  }

  logData(e) {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log(this.state.editorState.getSelection().toJS());
  }

  toggleEdit(e) {
    this.setState({
      editorEnabled: !this.state.editorEnabled
    });
  }

  onFileDrop(files) {
    console.log(files);
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
          onFileDrop={this.onFileDrop}
        />
        <div className="editor-action">
          <button onClick={this.logData}>Log State</button>
          <button onClick={this.toggleEdit}>Toggle Edit</button>
        </div>
      </div>
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
