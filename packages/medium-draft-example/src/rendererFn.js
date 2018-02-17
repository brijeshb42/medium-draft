import { rendererFn, Block } from 'medium-draft';

import AtomicBlock from './atomicBlock';
import AtomicEmbedComponent from './atomicEmbedComponent';
import AtomicSeparatorComponent from './atomicSeparatorComponent';

/**
 * Wrapper over medium-draft's rendererFn to use local components
 */
export default (setEditorState, getEditorState) => {
  const atomicRenderers = {
    embed: AtomicEmbedComponent,
    separator: AtomicSeparatorComponent,
  };

  const rFnNew = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case Block.ATOMIC:
        return {
          component: AtomicBlock,
          editable: false,
          props: {
            components: atomicRenderers,
            getEditorState,
          },
        };
      default:
        return rendererFn(setEditorState, getEditorState)(contentBlock);
    }
  };
  return rFnNew;
};
