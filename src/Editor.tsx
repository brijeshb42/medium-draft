import React from 'react';

import PluginsEditor, { DraftPlugin, PluginEditorProps } from './plugin_editor/Editor';
import blockMovePlugin from './plugins/blockMovePlugin';
import stylePlugin from './plugins/style';
import rendererPlugin from './plugins/blockRendererFn';
import keyboardPlugin from './plugins/keyboardPlugin';
import codeBlockPlugin from './plugins/codeblockplugin';
import imageBlockPlugin from './plugins/imageblockPlugin';

import { StringToTypeMap, Block } from './util/constants';
import { getSelectionRect, getSelection, getSelectedBlockNode } from './util';

export interface EditorProps extends PluginEditorProps {
  autoFocus?: boolean,
  disableToolbar?: boolean,
  stringToTypeMap?: {[key: string]: string},
  continuousBlocks?: Array<String>,
  editorEnabled?: boolean,
};
type EditorRefCb = (editor: PluginsEditor) => void;
type InputRefCb = (node: HTMLInputElement) => void;

type State = {
  showInput: boolean;
  title: string;
  style: Object;
};

/**
 * The main editor component with all the bells and whistles
 */
export default class Editor extends React.PureComponent<EditorProps, State> {
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

    this.plugins = [
      codeBlockPlugin(),
      imageBlockPlugin(),
      stylePlugin(),
      rendererPlugin(),
      blockMovePlugin(),
      keyboardPlugin(),
    ].concat(
      props.plugins.length ? props.plugins : [],
    );
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
    const currentBlockElement = getSelectedBlockNode(window);

    let style = {
      top: 0,
    };

    if (currentBlockElement) {
      style.top = currentBlockElement.getBoundingClientRect().top + window.scrollY;
    }

    this.setState({
      title,
      style,
      showInput: true,
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

  renderInput() {
    const { showInput, title, style } = this.state;

    if (!showInput) {
      return null;
    }

    return (
      <div className="md-modal-container" tabIndex={-1}>
        <div className="md-modal-input" style={style}>
          <div className="md-modal-input__wrapper">
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
      </div>
    );
  }

  render() {
    const {
      disableToolbar,
      editorEnabled,
      autoFocus,
      stringToTypeMap,
      continuousBlocks,
      ...restProps
    } = this.props;

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
        {this.renderInput()}
      </div>
    );
  }
}
