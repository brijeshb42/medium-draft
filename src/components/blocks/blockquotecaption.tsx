// import './blockquotecaption.scss';

import React from 'react';
import { EditorBlock } from 'draft-js';

export default (props: any) => (
  <cite>
    <EditorBlock {...props} />
  </cite>
);
