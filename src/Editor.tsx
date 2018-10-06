import * as React from 'react';
import * as Draft from 'draft-js';
import PluginsEditor, { DraftPlugin } from 'draft-js-plugins-editor';

import stylePlugin from './plugins/style';
import rendererPlugin from './plugins/blockRendererFn';
import { createEditorState } from './model';

type State = {
  editorState: Draft.EditorState,
};

type Props = {
  placeholder: string,
  autoFocus: boolean,
};
type RefCb = (editor: PluginsEditor) => void;

export default class Editor extends React.Component<Props, State> {
  editorRef: React.RefObject<PluginsEditor> | RefCb;
  editor?: PluginsEditor;
  plugins: Array<DraftPlugin>;

  static defaultProps = {
    placeholder: 'Write your story...',
    autoFocus: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      editorState: createEditorState(),
    };

    if (React.createRef) {
      this.editorRef = React.createRef();
    } else {
      this.editorRef = (editor) => {
        this.editor = editor;
      }
    }

    this.plugins = [stylePlugin(), rendererPlugin()];
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus();
    }
  }

  onChange = (es: Draft.EditorState) => {
    this.setState({
      editorState: es,
    });
  }

  focus() {
    if (typeof this.editorRef === 'object' && this.editorRef.current) {
      this.editorRef.current.focus();
    } else {
      this.editor.focus();
    }
  }

  render() {
    return (
      <PluginsEditor
        ref={this.editorRef}
        plugins={this.plugins}
        placeholder={this.props.placeholder}
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
}
