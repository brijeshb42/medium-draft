import * as React from 'react';
import * as Draft from 'draft-js';
import * as Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { DraftPlugin, PluginFunctions } from 'draft-js-plugins-editor';

import { HANDLED, NOT_HANDLED } from '../util/constants';

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
      // switch (key) {
      //   case 'blockRendererFn':
      //   case 'blockStyleFn':
        mainProps[key] = function (...args: any[]) {
          for(let i=0; i<handlers.length; i++) {
            const handler = handlers[i];
            const result = handler(...args, getters());

            if (result !== null && result !== undefined) {
              return result;
            }
          }
          return null;
          // }
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

function getBlockRenderMap(plugins: Array<DraftPlugin>): Immutable.Map<string, Object> {
  const blockRenderMap = plugins
    .filter(plugin => !!plugin.blockRenderMap)
    .reduce((acc, plugin) => (acc.merge(plugin.blockRenderMap)), Immutable.Map({}));
  return blockRenderMap.merge(Draft.DefaultDraftBlockRenderMap);
}

class PluginsEditor extends React.PureComponent<PluginEditorProps> {
  static defaultProps: ExtraPropTypes = {
    plugins: [],
  };

  parsePlugins: (plugins: Array<DraftPlugin>, getters?: () => PluginFunctions) => any;
  blockRenderMapPlugins: (plugins : Array<DraftPlugin>) => Immutable.Map<string, Object>;
  editor: HTMLElement;

  constructor(props: PluginEditorProps) {
    super(props);

    this.parsePlugins = memoizeOne(getMainPropsFromPlugins);
    this.blockRenderMapPlugins = memoizeOne(getBlockRenderMap);
  }

  componentWillUnmount() {
    this.props.plugins.filter(pl => !!pl.willUnmount).forEach(pl => pl.willUnmount({
      getEditorState: () => this.props.editorState,
      setEditorState: () => this.onChange,
    }))
  }

  editorRefCb = (node: HTMLElement) => {
    this.editor = node;
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

  onChange = (editorState: Draft.EditorState) => {
    const plugins = this.parsePlugins(this.props.plugins, this.getters);
    let newEditorState = editorState;

    if (plugins.onChange) {
      plugins.onChange.forEach((onCh: Function) => {
        const es = onCh(newEditorState);
        if (es) {
          newEditorState = es;
        }
      });
    }

    this.props.onChange(newEditorState);
  }

  render() {
    const draftProps = this.parsePlugins(this.props.plugins, this.getters);
    const blockRenderMap = this.blockRenderMapPlugins(this.props.plugins);

    return (
      <Draft.Editor
        {...this.props}
        {...draftProps}
        blockRenderMap={blockRenderMap}
        onChange={this.onChange}
        ref={this.editorRefCb}
      />
    );
  }
}

export default PluginsEditor;
