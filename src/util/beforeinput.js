export default (str) => {
  const { editorState } = this.state;
  const selection = editorState.getSelection();
  const block = getCurrentBlock(editorState);
  const blockType = block.getType();
  const blockLength = block.getLength();
  if (selection.getAnchorOffset() > 1) {
    return false;
  }
  if (block.text[0]+str === '--' && blockType !== 'caption' && blockType !== 'block-quote-caption') {
    if (blockType === 'blockquote') {
      this.onChange(resetBlockWithType(editorState, 'block-quote-caption'));
    } else {
      this.onChange(resetBlockWithType(editorState, 'caption'));
    }
    return true;
  }
  if (block.text[0]+str === '""' && blockType !== 'blockquote') {
    this.onChange(resetBlockWithType(editorState, 'blockquote'));
    return true;
  }
  if ((block.text[0] + str) == '* ' && blockType !== 'unordered-list-item') {
    this.onChange(resetBlockWithType(editorState, 'unordered-list-item'));
    return true;
  } else if ((block.text[0] + str) == '1.' && blockType !== 'ordered-list-item') {
    this.onChange(resetBlockWithType(editorState, 'ordered-list-item'));
    return true;
  } else if (block.text[0] + str === '##' && blockType !== 'header-three') {
    this.onChange(resetBlockWithType(editorState, 'header-three'));
    return true;
  } else if (block.text[0] + str === '==' && blockType !== 'unstyled') {
    this.onChange(resetBlockWithType(editorState, 'unstyled'));
    return true;
  }
  return false;
}
