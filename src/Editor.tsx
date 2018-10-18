import * as React from 'react';
// import * as Prism from 'prismjs';
// import prismPlugin from 'draft-js-prism-plugin';

import PluginsEditor, { DraftPlugin, PluginEditorProps } from './plugin_editor/Editor';
import blockMovePlugin from './plugins/blockMovePlugin';
import stylePlugin from './plugins/style';
import rendererPlugin from './plugins/blockRendererFn';
import keyboardPlugin from './plugins/keyboardPlugin';
import codeBlockPlugin from './plugins/codeblockplugin';
import imageBlockPlugin from './plugins/imageblockPlugin';

import { StringToTypeMap, Block } from './util/constants';
import { getSelectionRect, getSelection } from './util';

export type EditorProps = PluginEditorProps & {
  autoFocus?: boolean,
  disableToolbar?: boolean,
  stringToTypeMap: {[key: string]: string},
  continuousBlocks: Array<String>,
  editorEnabled: boolean,
};
type EditorRefCb = (editor: PluginsEditor) => void;
type InputRefCb = (node: HTMLInputElement) => void;

type State = {
  showInput: boolean;
  title: string;
  style: Object;
};

export default class Editor extends React.Component<EditorProps, State> {
  editorRef: React.RefObject<PluginsEditor> | EditorRefCb;
  inputRef: React.RefObject<HTMLInputElement> | InputRefCb;
  editor?: PluginsEditor;
  input?: HTMLInputElement;
  plugins: Array<DraftPlugin>;
  private inputPromise?: {
    resolve: (input: string) => void,
    reject: () => void,
  } = null;

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
    plugins: [] as Array<DraftPlugin>,
  };

  constructor(props: EditorProps) {
    super(props);

    if (React.createRef) {
      this.editorRef = React.createRef();
      this.inputRef = React.createRef();
    } else {
      this.editorRef = (editor) => {
        this.editor = editor;
      }

      this.inputRef = (node) => {
        this.input = node;
      };
    }

    this.state = {
      showInput: false,
      title: '',
      style: {},
    };

    this.plugins = props.plugins.length ? props.plugins : [
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

  componentDidUpdate(prevProps: EditorProps, prevState: State) {
    if (this.state.showInput && (!prevState.showInput)) {
      if (typeof this.inputRef === 'object' && this.inputRef.current) {
        this.inputRef.current.focus();
      } else {
        this.input.focus();
      }
    }
  }

  focus() {
    if (typeof this.editorRef === 'object' && this.editorRef.current) {
      this.editorRef.current.focus();
    } else {
      this.editor.focus();
    }
  }

  handleInputKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.which !== 13 && ev.which !== 27) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    if (this.inputPromise) {
      if (ev.which === 13) {
        this.inputPromise.resolve((ev.target as HTMLInputElement).value);
      } else {
        this.inputPromise.reject();
      }
      this.inputPromise = null;
    }

    this.setState({
      title: '',
      showInput: false,
      style: {},
    }, () => {
      this.focus();
    });
  };

  getInput = (title: string): Promise<string> => {
    // const selection = this.props.editorState.getSelection();
    // const anchorKey = selection.getAnchorKey();
    const rect = getSelectionRect(getSelection(window));

    this.setState({
      title,
      showInput: true,
      style: (rect) ? {
        top: rect.top,
      } : {},
    });

    return new Promise<string>((resolve, reject) => {
      this.inputPromise = {
        resolve,
        reject,
      };
    });
  };

  getMethods = () => {
    return {
      getInput: this.getInput,
    };
  };

  render() {
    const {
      disableToolbar,
      editorEnabled,
      autoFocus,
      stringToTypeMap,
      continuousBlocks,
      ...restProps
    } = this.props;
    const { showInput, title, style } = this.state;

    const editorClass = `md-RichEditor-editor${!editorEnabled ? ' md-RichEditor-readonly' : ''}`;

    return (
      <div className="md-RichEditor-root">
        <div className={editorClass}>
          <PluginsEditor
            {...restProps}
            ref={this.editorRef}
            plugins={this.plugins}
            getParentMethods={this.getMethods}
          />
        </div>
        {
          showInput && (
            <div className="md-modal-container" tabIndex={-1}>
              <div className="md-modal-input" style={style}>
                <label>
                  {title}
                  <input
                    type="text"
                    defaultValue=""
                    ref={this.inputRef}
                    onKeyDown={this.handleInputKeyDown}
                  />
                </label>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
