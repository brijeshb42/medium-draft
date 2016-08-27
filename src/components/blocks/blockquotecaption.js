// import './blockquotecaption.scss';

import React from 'react';
import { EditorBlock } from 'draft-js';

export default (props) => (
  <cite>
    <EditorBlock {...props} />
  </cite>
);
