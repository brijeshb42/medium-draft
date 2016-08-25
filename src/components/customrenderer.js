import QuoteCaptionComponent from './blocks/blockquotecaption';
import CaptionComponent from './blocks/caption';
import AtomicBlock from './blocks/atomic';
import TodoBlock from './blocks/todo';
import ImageBlock from './blocks/image';
import BreakBlock from './blocks/break';

import { Block } from '../util/constants';

export default (onChange, getEditorState) => (contentBlock) => {
  // console.log(editorState, onChange);
  const type = contentBlock.getType();
  switch (type) {
    case Block.BLOCKQUOTE_CAPTION: return {
      component: QuoteCaptionComponent,
    };
    case Block.CAPTION: return {
      component: CaptionComponent,
    };
    case Block.ATOMIC: return {
      component: AtomicBlock,
      editable: false,
    };
    case Block.TODO: return {
      component: TodoBlock,
      props: {
        onChange,
        getEditorState,
      },
    };
    case Block.IMAGE: return {
      component: ImageBlock,
    };
    case Block.BREAK: return {
      component: BreakBlock,
      editable: false,
    };
    default: return null;
  }
}
