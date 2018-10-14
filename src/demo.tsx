import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'draft-js/dist/Draft.css';
import 'prismjs/themes/prism-solarizedlight.css';
import './index.scss';
import './demo.css';

import { Editor } from './';

ReactDOM.render(<Editor autoFocus />, document.getElementById('root'));
