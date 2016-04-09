import './text.scss';

import React, {Component, PropTypes} from "react";
import { EditorBlock } from 'draft-js';

export default class Paragraph extends Component {
   render(){
   	// console.log(this.props);
    return (
      <div data-block={true} className="block block-paragraph">
         <EditorBlock {...this.props} />
      </div>
    );
   }
}
