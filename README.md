# medium-draft - [demo](http://bitwiser.in/medium-draft/)

A medium like rich text editor built upon [draft-js](https://facebook.github.io/draft-js/) with an emphasis on eliminating mouse usage by adding relevant keyboard shortcuts.

> Current development is using the latest master branch of `draft-js` for using block level metadata support to implement Todo lists inside the editor.

### Fetures

- Focus on keyboard shortcuts and auto transform of text blocks.
- Image addition via URL.
- Minimize mouse usage
- Autolists
- Proper handling of `RETURN` presses.
- It also has implementations of some custom blocks like:
    - `caption` - Can be used as a caption for media blocks like image or video instead of nested `draft-js` instances for simplicity.
    - `block-quote-caption` - Caption for `blockquote`s.
    - `todo` - Todo text with a checkbox.

##### Following are the keyboard shortcuts to toggle block types (<kbd>Alt and CTRL</kbd> for Windows/Linux and <kbd>Option and Command</kbd> for OSX)
*   <kbd>Alt/Option</kbd> +

    *   <kbd>1</kbd> - Toggle Ordered list item
    *   <kbd>*</kbd> - Toggle Unordered list item
    *   <kbd>@</kbd> - Add link to selected text.
    *   <kbd>#</kbd> - Toggle Header-three.
    *   <kbd><</kbd> - Toggle Caption block.
    *   <kbd>></kbd> - Toggle unstyled or paragraph block.
    *   <kbd>H</kbd> - Highlight selection.

##### Editor level commands

These commands are not a part of the core editor but has been implemeted in the example code that uses the `medium-draft` editor.

*   <kbd>Command/CTRL</kbd> + <kbd>S</kbd> - Save current data to `localstorage`.
*   <kbd>Alt + Shift</kbd> + <kbd>L</kbd> - Load previously saved data from `localstorage`.

##### Special characters while typing: While typing in an empty block, if the content matches one of the following, that particular block's type and look will be changed to the corresponding block specified below

*   `--` - If current block is `blockquote`, it will be changed to `block-quote-caption`, else `caption`.
*   `''` or `""` or `> ` - `blockquote`.
*   `*.` `(An asterisk and a period)` - `unordered-list-item`.
*   `*<SPACE>` `(An asterisk and a space)` - `unordered-list-item`.
*   `-<SPACE>` `(A hyphen and a space)` - `unordered-list-item`.
*   `1.` `(The number 1 and a period)` - `unordered-list-item`.
*   `##` - `header-two`.
*   `[]` - `todo`.
*   `==` - `unstyled`.

### Usage

`medium-draft` sits on top of `draft-js` with some built in functionalities and blocks. Its API is almost the same as that of `draft-js`. You can take a look at [the demo editor's code](https://github.com/brijeshb42/medium-draft/tree/master/src/example.js) to see the implemetation.

At the minimum, you need to provide `editorState` and `onChange` props, the same as `draft-js`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  EditorState,
  CompositeDecorator,
} from 'draft-js';

import {
  Editor,
  Link,
  findLinkEntities,
} from './index';


class App extends React.Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
    };

    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        ref="editor"
        editorState={editorState}
        onChange={this.onChange} />
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

### Issues

- [x] Currently, the toolbar that appears when text is selected needs to be fixed regarding its position in the viewport.

### Developer

- Clone this repo `git clone https://github.com/brijeshb42/medium-draft.git`.
- Install node packages `npm install`.
- Start local demo `npm run dev`. This will start a local server on port `8080`.
- Build using `npm run build`.

#### LICENSE

MIT
