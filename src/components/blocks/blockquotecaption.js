import './blockquotecaption.scss';

import React from "react";
import { EditorBlock } from 'draft-js';

export default (props) => (
  <blockquote data-block={true} className="block block-quote RichEditor-blockquote">
    <cite>
      <EditorBlock {...props} />
    </cite>
  </blockquote>
);
