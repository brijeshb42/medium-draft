import React from 'react';
import ReactDOM from 'react-dom';

import Editor from './editor';
import data from 'json!./data.json';

setTimeout(() => {
  ReactDOM.render(
    <Editor value={data} />,
    document.getElementById('app')
  );
}, 100);
