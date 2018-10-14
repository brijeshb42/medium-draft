declare module "draft-js/lib/isSoftNewlineEvent" {
  import * as React from 'react';

  function isSoftNewlineEvent(ev: React.KeyboardEvent<{}>): boolean;

  export default isSoftNewlineEvent;
}

declare module "draft-js-prism-plugin" {

  function prismPlugin(options: Object): any;

  export default prismPlugin;
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
    onRightArrow?: any,
    onDownArrow?: any,
    onLeftArrow?: any,
    onFocus?: any,
    onBlur?: any,
    decorators?: Array<any>,
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
