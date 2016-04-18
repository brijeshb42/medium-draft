# medium-draft - [demo](http://bitwiser.in/medium-draft/)

A medium like rich text editor built upon [draft-js](https://facebook.github.io/draft-js/) with an emphasis on eliminating mouse usage by adding relevant keyboard shortcuts.

* It also has implementations of some custom blocks like:
    * `caption` - Can be used as a caption for media blocks like image or video instead of nested `draft-js` instances for simplicity.
    * `block-quote-caption` - Caption for `blockquote`s.

##### Following are the keyboard shortcuts to toggle block types (<kbd>Alt and CTRL</kbd> for Windows/Linux and <kbd>Option and Command</kbd> for OSX)
*   **<kbd>Alt/Option</kbd> + **

    *   <kbd>1</kbd> - Toggle Ordered list item
    *   <kbd>*</kbd> - Toggle Unordered list item
    *   <kbd>@</kbd> - Add link to selected text.
    *   <kbd>#</kbd> - Toggle Header-three.
    *   <kbd><</kbd> - Toggle Caption block.
    *   <kbd>></kbd> - Toggle unstyled or paragraph block.

##### Editor level commands

*   <kbd>Command/CTRL</kbd> + <kbd>S</kbd> - Save current data to `localstorage`.
*   <kbd>Alt + Shift</kbd> + <kbd>D</kbd> - Load previously saved data from `localstorage`.

##### Special characters while typing: If while typing in an empty block, if the content matches one of the following, that particular block's type will be changed to the corresponding block specified below

*   `--` `(2 hyphens)` - If current block is `blockquote`, it will be changed to `block-quote-caption`, else `caption`.
*   `''` `(2 single or double quotes)` - `blockquote`.
*   `*.` `(An asterisk and a period)` - `unordered-list-item`.
*   `1.` `(The number 1 and a period)` - `unordered-list-item`.
*   `##` - `header-three`.
*   `==` - `unstyled`.

### Issues
>
Currently, the toolbar that appears when text is selected needs to be fixed regrading its position in the viewport.

#### LICENSE

MIT
