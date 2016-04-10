import './blockquotecaption.scss';

import React from "react";
import { EditorBlock } from 'draft-js';

export default (props) => (
  <blockquote className="block block-quote RichEditor-blockquote block-quote-caption">
    <cite>
      <EditorBlock {...props} />
    </cite>
  </blockquote>
);
