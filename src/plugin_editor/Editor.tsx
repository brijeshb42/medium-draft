import * as React from 'react';
import * as Draft from 'draft-js';
import { CompositeDecorator } from 'draft-js';
import * as Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { DraftPlugin, PluginFunctions } from 'draft-js-plugins-editor';

import MultiDecorator from './MultiDecorator';
import { HANDLED, NOT_HANDLED } from '../util/constants';

export type DraftDecoratorType = Array<{
  strategy: (contentBlock: Draft.ContentBlock, callback: (start: number, end: number) => void, contentState?: Draft.ContentState) => void,
  component: React.SFC<any> | React.Component<any>,
} | Draft.CompositeDecorator>

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
        if (dec.strategy) {
          acc.push(new CompositeDecorator([dec]));
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

    this.parsePlugins = memoizeOne(getMainPropsFromPlugins);
    this.blockRenderMapPlugins = memoizeOne(getBlockRenderMap);
    this.pluginDecorators = memoizeOne(getDecorators);

    const decorator = this.pluginDecorators(props.plugins);
    props.onChange(Draft.EditorState.set(props.editorState, {
      decorator,
    }));
  }

  componentDidUpdate(prevProps: PluginEditorProps) {
    const { plugins, editorState, onChange } = this.props;

    if (prevProps.plugins !== plugins) {
      const decorator = this.pluginDecorators(plugins);

      if (decorator !== editorState.getDecorator()) {
        onChange(Draft.EditorState.set(editorState, {
          decorator,
        }));
      }
    }
  }

  componentWillUnmount() {
    this.props.plugins.filter(pl => !!pl.willUnmount).forEach(pl => pl.willUnmount({
      getEditorState: () => this.props.editorState,
      setEditorState: () => this.onChange,
    }))
  }

  editorRefCb = (node: Draft.Editor) => {
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
    // const plugins = this.parsePlugins(this.props.plugins, this.getters);
    // let newEditorState = editorState;

    // if (plugins.onChange) {
    //   plugins.onChange.forEach((onChange: (Draft.EditorState) => void) => {
    //     const es = onChange(newEditorState);
    //     if (es) {
    //       newEditorState = es;
    //     }
    //   });
    // }

    this.props.onChange(editorState);
  }

  render() {
    const draftProps = this.parsePlugins(this.props.plugins, this.getters);
    const blockRenderMap = this.blockRenderMapPlugins(this.props.plugins) as Immutable.Map<Draft.DraftBlockType, any>;

    return (
      <Draft.Editor
        {...this.props}
        {...draftProps}
        ref={this.editorRefCb}
        onChange={this.onChange}
        blockRenderMap={blockRenderMap}
      />
    );
  }
}

export default PluginsEditor;
