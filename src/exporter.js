import React from 'react';
import { convertToHTML } from 'draft-convert';

import { Inline, Block, Entity } from './util/constants';

export const styleToHTML = (style) => {
  switch (style) {
    case Inline.ITALIC:
      return <em className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.BOLD:
      return <strong className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.STRIKETHROUGH:
      return <strike className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.UNDERLINE:
      return <u className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.HIGHLIGHT:
      return <span className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.CODE:
      return <code className={`md-inline-${style.toLowerCase()}`} />;
    default:
      return null;
  }
};

export const blockToHTML = (block) => {
  const blockType = block.type;
  const blockClass = blockType.toLowerCase();

  switch (blockType) {
    case Block.H1:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h1 className={`md-block-${blockClass}`} />;
    case Block.H2:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h2 className={`md-block-${blockClass}`} />;
    case Block.H3:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h3 className={`md-block-${blockClass}`} />;
    case Block.H4:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h4 className={`md-block-${blockClass}`} />;
    case Block.H5:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h5 className={`md-block-${blockClass}`} />;
    case Block.H6:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h6 className={`md-block-${blockClass}`} />;
    case Block.BLOCKQUOTE_CAPTION:
    case Block.CAPTION:
      return {
        start: `<p class="md-block-${blockClass}"><caption>`,
        end: '</caption></p>',
      };
    case Block.IMAGE: {
      const imgData = block.data;
      const text = block.text;
      const extraClass = (text.length > 0 ? ' md-block-image-has-caption' : '');
      return {
        start: `<figure class="md-block-image${extraClass}"><img src="${imgData.src}" alt="${block.text}" /><figcaption class="md-block-image-caption">`,
        end: '</figcaption></figure>',
      };
    }
    case Block.ATOMIC:
      return {
        start: `<figure class="md-block-${blockClass}">`,
        end: '</figure>',
      };
    case Block.TODO: {
      const checked = block.data.checked || false;
      let inp = '';
      let containerClass = '';
      if (checked) {
        inp = '<input type=checkbox disabled checked="checked" />';
        containerClass = 'md-block-todo-checked';
      } else {
        inp = '<input type=checkbox disabled />';
        containerClass = 'md-block-todo-unchecked';
      }
      return {
        start: `<div class="md-block-${blockType} ${containerClass}">${inp}<p>`,
        end: '</p></div>',
      };
    }
    case Block.BREAK:
      return <hr className={`md-block-${blockType}`} />;
    case Block.BLOCKQUOTE:
      return <blockquote className={`md-block-${blockType}`} />;
    case Block.OL:
      return {
        element: <li />,
        nest: <ol className={`md-block-${blockType}`} />,
      };
    case Block.UL:
      return {
        element: <li />,
        nest: <ul className={`md-block-${blockType}`} />,
      };
    case Block.UNSTYLED:
      if (block.text.length < 1) {
        return <p className={`md-block-${blockType}`}><br /></p>;
      }
      return <p className={`md-block-${blockType}`} />;
    case Block.CODE:
      return {
        element: <pre className={`md-block-${blockType}`} />,
        nest: <div className="md-block-code-container" />,
      };
    default: return null;
  }
};


export const entityToHTML = (entity, originalText) => {
  if (entity.type === Entity.LINK) {
    return (
      <a
        className="md-inline-link"
        href={entity.data.url}
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

export const setRenderOptions = (htmlOptions = options) => convertToHTML(htmlOptions);


export default (contentState, htmlOptions = options) => convertToHTML(htmlOptions)(contentState);
