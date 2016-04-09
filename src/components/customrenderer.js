import TextComponent from './blocks/text';
import CaptionComponent from './blocks/blockquotecaption';

export default (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case 'unstyled': return {
      component: TextComponent
    };
    case 'block-quote-caption': return {
      component: CaptionComponent
    };
  }
}
