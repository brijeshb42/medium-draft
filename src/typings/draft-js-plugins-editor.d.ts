declare module "draft-js-plugins-editor" {
  import * as React from 'react';
  import * as Draft from 'draft-js';
  import * as Immutable from 'immutable';

  interface PluginFunctions {
    getPlugins: () => Array<Plugin>,
    getProps: () => Draft.EditorProps,
    setEditorState: (editorState: Draft.EditorState) => void,
    getEditorState: () => Draft.EditorState,
    getReadOnly: () => boolean,
    setReadOnly: (readOnly: boolean) => void,
    getEditorRef: () => null | undefined | HTMLElement,
  }

  interface EditorProps extends Draft.EditorProps {
    plugins?: Array<DraftPlugin>,
  }

  interface DraftPlugin {
    blockRendererFn?: (cb: Draft.ContentBlock) => {
      component: React.Component<any> | React.SFC,
      editable?: boolean,
      props?: Object,
    } | null,
    keyBindingFn?: any,
    blockStyleFn?: (contentBlock: Draft.ContentBlock) => string,
    blockRenderMap?: Immutable.Map<string, {element: string, aliasedElements?: Array<string>}>,
    customStyleMap?: Object,
    handleReturn?: any,
    handleKeyCommand?: any,
    handleBeforeInput?: any,
    handlePastedText?: any,
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
