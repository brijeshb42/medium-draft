declare module "draft-js/lib/isSoftNewlineEvent" {
  import * as React from 'react';

  function isSoftNewlineEvent(ev: React.KeyboardEvent<{}>): boolean;

  export default isSoftNewlineEvent;
}

declare module "draft-js-plugins-editor" {
  import * as React from 'react';
  import * as Draft from 'draft-js';
  import * as Immutable from 'immutable';

  interface PluginFunctions {
    getPlugins: () => Array<Plugin>,
    getProps: () => Object,
    setEditorState: (editorState: Draft.EditorState) => void,
    getEditorState: () => Draft.EditorState,
    getReadOnly: () => boolean,
    setReadOnly: (readOnly: boolean) => void,
    getEditorRef: () => null | undefined | HTMLElement,
  }

  interface EditorProps extends Draft.EditorProps {
    plugins?: Array<DraftPlugin>,
  }

  type HandlerReturn = 'handled' | 'not_handled';

  interface DraftPlugin {
    blockRendererFn?: (cb: Draft.ContentBlock, draftPluginFns: PluginFunctions) => {
      component: React.ComponentType | React.StatelessComponent,
      editable?: boolean,
      props?: Object,
    } | null,
    keyBindingFn?: (ev: React.KeyboardEvent<{}>, draftPluginFns: PluginFunctions) => string,
    blockStyleFn?: (contentBlock: Draft.ContentBlock) => string,
    blockRenderMap?: Immutable.Map<string, {element: string, aliasedElements?: Array<string>}>,
    customStyleMap?: Object,
    handleReturn?: (ev: React.KeyboardEvent<{}>, es: Draft.EditorState, draftPluginFns: PluginFunctions) => HandlerReturn,
    handleKeyCommand?: (command: string, es: Draft.EditorState, draftPluginFns: PluginFunctions) => HandlerReturn,
    handleBeforeInput?: (input: string, es: Draft.EditorState, draftPluginFns: PluginFunctions) => HandlerReturn,
    handlePastedText?: (text: string, html: string, editorState: Draft.EditorState, draftPluginFns: PluginFunctions) => HandlerReturn,
    handlePastedFiles?: any,
    handleDroppedFiles?: any,
    handleDrop?: any,
    onEscape?: any,
    onTab?: any,
    onUpArrow?: any,
    onRightArrow?: any,
    onDownArrow?: any,
    onLeftArrow?: any,
    onFocus?: any,
    onBlur?: any,
  }

  class Editor extends React.Component<EditorProps> {
    focus(): void;
    blur(): void;
  }

  export {
    PluginFunctions,
    DraftPlugin,
  };
  export default Editor;
}
