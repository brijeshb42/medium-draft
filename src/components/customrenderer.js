// import TextComponent from './blocks/text';
import QuoteCaptionComponent from './blocks/blockquotecaption';
import CaptionComponent from './blocks/caption';
import AtomicBlock from './blocks/atomic';

export default (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    // case 'unstyled': return {
    //   component: TextComponent
    // };
    case 'block-quote-caption': return {
      component: QuoteCaptionComponent
    };
    case 'caption': return {
      component: CaptionComponent
    };
    case 'atomic': return {
      component: AtomicBlock,
      editable: false
    };
    default: return null;
  }
}
