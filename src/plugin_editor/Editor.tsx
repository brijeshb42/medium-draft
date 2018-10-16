import * as React from 'react';
import * as Draft from 'draft-js';
import { CompositeDecorator } from 'draft-js';
import * as Immutable from 'immutable';
import memoizeOne from 'memoize-one';

import MultiDecorator from './MultiDecorator';
import { HANDLED, NOT_HANDLED } from '../util/constants';

export interface PluginFunctions {
  getPlugins: () => Array<DraftPlugin>,
  getProps: () => Object,
  setEditorState: (editorState: Draft.EditorState) => void,
  getEditorState: () => Draft.EditorState,
  getReadOnly: () => boolean,
  setReadOnly: (readOnly: boolean) => void,
  getEditorRef?: () => any,
}

export interface EditorProps extends Draft.EditorProps {
  plugins?: Array<DraftPlugin>,
}

export type SimpleDecorator = {
  strategy: (block: Draft.ContentBlock, callback: (start: number, end: number) => void, contentState: Draft.ContentState) => void;
  component: Function;
  props?: Object;
};

export type DraftDecoratorType = SimpleDecorator | Draft.CompositeDecorator;

export type HandlerReturn = 'handled' | 'not_handled';

export interface DraftPlugin {
  blockRendererFn?: (cb: Draft.ContentBlock, draftPluginFns: PluginFunctions) => {
    component: React.ComponentType | React.StatelessComponent,
    editable?: boolean,
    props?: Object,
  } | null,
  keyBindingFn?: (ev: React.KeyboardEvent<{}>, draftPluginFns: PluginFunctions) => string | void,
  blockStyleFn?: (contentBlock: Draft.ContentBlock) => string,
  blockRenderMap?: Immutable.Map<string, {
    element: string;
    wrapper?: React.ReactElement<any>;
    aliasedElements?: Array<string>;
  }>,
  customStyleMap?: Object,
  handleReturn?: (ev: React.KeyboardEvent<{}>, es: Draft.EditorState, draftPluginFns: PluginFunctions) => Draft.DraftHandleValue,
  handleKeyCommand?: (command: string, es: Draft.EditorState, draftPluginFns: PluginFunctions) => Draft.DraftHandleValue,
  handleBeforeInput?: (input: string, es: Draft.EditorState, draftPluginFns: PluginFunctions) => Draft.DraftHandleValue,
  handlePastedText?: (text: string, html: string, editorState: Draft.EditorState, draftPluginFns: PluginFunctions) => Draft.DraftHandleValue,
  handlePastedFiles?: any,
  handleDroppedFiles?: (selection: Draft.SelectionState, files: Array<Blob>, draftPluginFns: PluginFunctions) => Draft.DraftHandleValue,
  handleDrop?: (selection: Draft.EditorState, dataTransfer: DataTransfer, isInternal: Draft.DraftDragType, draftPluginFns: PluginFunctions) => Draft.DraftHandleValue,
  onEscape?: any,
  onTab?: (ev: React.KeyboardEvent<{}>, draftPluginFns: PluginFunctions) => void,
  onUpArrow?: (ev: React.KeyboardEvent<{}>, draftPluginFns: PluginFunctions) => void,
  onchange?: (es: Draft.EditorState, draftPluginFns: PluginFunctions) => Draft.EditorState,
  onRightArrow?: any,
  onDownArrow?: (ev: React.KeyboardEvent<{}>, draftPluginFns: PluginFunctions) => void,
  onLeftArrow?: any,
  onFocus?: any,
  onBlur?: any,
  decorators?: Array<DraftDecoratorType>,
  willUnmount?: (draftPluginFns: PluginFunctions) => void,
  initialize?: (draftPluginFns: PluginFunctions) => void,
}

type ExtraPropTypes = {
  plugins?: Array<DraftPlugin>,
};

export type PluginEditorProps = Draft.EditorProps & ExtraPropTypes;

function getMainPropsFromPlugins(plugins: Array<DraftPlugin>, getters?: () => PluginFunctions): any {
  const props: { [key: string]: Array<any> } = {};

  plugins.forEach(plugin => {
    Object.keys(plugin).forEach(key => {
      props[key] = props[key] || [];
      props[key].push((plugin as any)[key]);
    });
  });

  const mainProps: { [key: string]: Function | Immutable.Map<string, Object> } = {};

  Object.keys(props).forEach(function (key) {
    if (key === 'onChange' || key === 'blockRenderMap') {
      return;
    }

    const handlers = props[key];

    if (key.indexOf('handle') === 0) {
      mainProps[key] = function (...args: any[]) {
        const returnVal: boolean = handlers.some(handler => {
          const returnVal: string | boolean = handler(...args, getters());
          if ((typeof returnVal === 'string' && returnVal === HANDLED) || returnVal === true) {
            return true;
          }
          return false;
        });
        return returnVal ? HANDLED : NOT_HANDLED;
      }
    } else if (key.indexOf('on') === 0) {
      mainProps[key] = function (...args: any[]) {
        return handlers.some(handler => {
          const retVal: boolean = handler(...args, getters());
          return !!retVal;
        });
      }
    } else if (key.indexOf('Fn') === (key.length - 'Fn'.length)) {
        mainProps[key] = function (...args: any[]) {
          for(let i=0; i<handlers.length; i++) {
            const handler = handlers[i];
            const result = handler(...args, getters());

            if (result !== null && result !== undefined) {
              return result;
            }
          }
          return null;
      }
    } else {
      switch (key) {
        case 'customStyleMap':
          mainProps[key] = handlers.reduce((acc, handler) => {
            return Object.assign(acc, handler);
          }, {});
      }
    }
  });
  return mainProps;
}

function getBlockRenderMap(plugins: Array<DraftPlugin>): Immutable.Map<string, any> {
  const blockRenderMap = plugins
    .filter(plugin => !!plugin.blockRenderMap)
    .reduce((acc, plugin) => (acc.merge(plugin.blockRenderMap)), Immutable.Map({}));
  return blockRenderMap.merge(Draft.DefaultDraftBlockRenderMap) as Immutable.Map<string, any>;
}

function getDecorators(plugins: Array<DraftPlugin>): MultiDecorator {
  const finalDecorators = plugins.filter(pl => !!pl.decorators).reduce(
    (acc, plugin) => {
      plugin.decorators.forEach((dec) => {
        if (!(dec instanceof CompositeDecorator)) {
          acc.push(new CompositeDecorator([dec as SimpleDecorator]));
        } else {
          acc.push(dec);
        }
      });
      return acc;
    },
    []
  );

  if (!finalDecorators.length) {
    return null;
  }

  return new MultiDecorator(finalDecorators);
}

class PluginsEditor extends React.PureComponent<PluginEditorProps> {
  static defaultProps: ExtraPropTypes = {
    plugins: [],
  };

  parsePlugins: (plugins: Array<DraftPlugin>, getters?: () => PluginFunctions) => Draft.EditorProps;
  blockRenderMapPlugins: (plugins : Array<DraftPlugin>) => Immutable.Map<string, any>;
  pluginDecorators: (plugins : Array<DraftPlugin>) => MultiDecorator;
  editor: Draft.Editor;

  constructor(props: PluginEditorProps) {
    super(props);

    const { plugins } = props;
    this.parsePlugins = memoizeOne(getMainPropsFromPlugins);
    this.blockRenderMapPlugins = memoizeOne(getBlockRenderMap);
    this.pluginDecorators = memoizeOne(getDecorators);

    const decorator = this.pluginDecorators(plugins);
    this.onChange(Draft.EditorState.set(props.editorState, {
      decorator,
    }));
    // Only for compatibility with other draft-js plugins
    plugins.filter(pl => !!pl.initialize).forEach(pl => pl.initialize(this.getters()));
  }

  componentDidUpdate(prevProps: PluginEditorProps) {
    const { plugins, editorState } = this.props;

    if (prevProps.plugins !== plugins) {
      const decorator = this.pluginDecorators(plugins);

      if (decorator !== editorState.getDecorator()) {
        this.onChange(Draft.EditorState.set(editorState, {
          decorator,
        }));
      }
    }
  }

  componentWillUnmount() {
    this.props.plugins.filter(pl => !!pl.willUnmount).forEach(pl => pl.willUnmount(this.getters()))
  }

  editorRefCb = (node: Draft.Editor) => {
    this.editor = node;
  };

  onChange = (es: Draft.EditorState) => {
    let newEs = es;
    const { plugins, onChange } = this.props;
    plugins.filter(pl => !!pl.onchange).forEach(pl => {
      const tmpEs = pl.onchange(newEs, this.getters());

      if (tmpEs) {
        newEs = tmpEs;
      }
    });

    onChange(newEs);
  };

  focus() {
    if (!this.editor) {
      return;
    }

    this.editor.focus();
  }

  blur() {
    if (!this.editor) {
      return;
    }

    this.editor.blur();
  }

  getters = (): PluginFunctions => ({
    setEditorState: this.onChange,
    getEditorState: () => this.props.editorState,
    getPlugins: () => this.props.plugins,
    getProps: (): PluginEditorProps => this.props,
    getReadOnly: () => this.props.readOnly,
    setReadOnly: (readOnly: boolean) => {},
    getEditorRef: () => this.editor,
  });

  render() {
    const draftProps = this.parsePlugins(this.props.plugins, this.getters);
    const blockRenderMap = this.blockRenderMapPlugins(this.props.plugins) as Immutable.Map<Draft.DraftBlockType, any>;

    return (
      <Draft.Editor
        {...this.props}
        {...draftProps}
        ref={this.editorRefCb}
        blockRenderMap={blockRenderMap}
        onChange={this.onChange}
      />
    );
  }
}

export default PluginsEditor;
