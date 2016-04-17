import React from 'react';
import ReactDOM from 'react-dom';

import Editor from './editor';

setTimeout(() => {
  ReactDOM.render(
    <Editor />,
    document.getElementById('app')
  );
}, 100);
