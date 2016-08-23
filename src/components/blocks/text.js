// import './text.scss';

import React, {Component, PropTypes} from "react";
import { EditorBlock } from 'draft-js';

export default class Paragraph extends Component {
   render(){
    return (
      <EditorBlock {...this.props} />
    );
   }
}
