import * as React from 'react';
import * as Draft from 'draft-js';
// import * as Prism from 'prismjs';
// import prismPlugin from 'draft-js-prism-plugin';

import PluginsEditor, { DraftPlugin } from './plugin_editor/Editor';
import blockMovePlugin from './plugins/blockMovePlugin';
import stylePlugin from './plugins/style';
import rendererPlugin from './plugins/blockRendererFn';
import keyboardPlugin from './plugins/keyboardPlugin';
import codeBlockPlugin from './plugins/codeblockplugin';
import imageBlockPlugin from './plugins/imageblockPlugin';

import { StringToTypeMap, Block } from './util/constants';

type State = {
  editorState: Draft.EditorState,
};

export type EditorProps = {
  placeholder?: string,
  autoFocus?: boolean,
  disableToolbar?: boolean,
  stringToTypeMap: {[key: string]: string},
  continuousBlocks: Array<String>,
  editorEnabled: boolean,
  handleKeyCommand?: (command: string) => 'handled' | 'not_handled' | boolean,
  editorState: Draft.EditorState,
  onChange: (es: Draft.EditorState) => void,
};
type RefCb = (editor: PluginsEditor) => void;

export default class Editor extends React.Component<EditorProps, State> {
  editorRef: React.RefObject<PluginsEditor> | RefCb;
  editor?: PluginsEditor;
  plugins: Array<DraftPlugin>;

  static defaultProps = {
    placeholder: 'Write your story...',
    autoFocus: false,
    disableToolbar: false,
    stringToTypeMap: StringToTypeMap,
    continuousBlocks: [
      Block.UNSTYLED,
      Block.BLOCKQUOTE,
      Block.OL,
      Block.UL,
      Block.CODE,
      Block.TODO,
    ],
    editorEnabled: true,
  };

  constructor(props: EditorProps) {
    super(props);

    if (React.createRef) {
      this.editorRef = React.createRef();
    } else {
      this.editorRef = (editor) => {
        this.editor = editor;
      }
    }

    this.plugins = [
      codeBlockPlugin(),
      imageBlockPlugin(),
      stylePlugin(),
      rendererPlugin(),
      blockMovePlugin(),
      keyboardPlugin(),
      // prismPlugin({
      //   prism: Prism,
      // }),
    ];
  }

  componentDidMount() {
    if (!this.props.autoFocus) {
      return;
    }

    setTimeout(() => {
      this.focus();
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
    const { editorEnabled, editorState, onChange, placeholder } = this.props;
    const editorClass = `md-RichEditor-editor${!editorEnabled ? ' md-RichEditor-readonly' : ''}`;

    return (
      <div className="md-RichEditor-root">
        <div className={editorClass}>
          <PluginsEditor
            ref={this.editorRef}
            plugins={this.plugins}
            placeholder={placeholder}
            editorState={editorState}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}
