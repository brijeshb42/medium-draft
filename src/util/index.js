export const getSelectionRect = (selected) => {
   var _rect = selected.getRangeAt(0).getBoundingClientRect();
   var rect = _rect && _rect.top ? _rect : selected.getRangeAt(0).getClientRects()[0];//selected.getRangeAt(0).getBoundingClientRect()
   if (!rect) {
      if(selected.anchorNode && selected.anchorNode.getBoundingClientRect){
         rect = selected.anchorNode.getBoundingClientRect();
         rect.isEmptyline = true;
      }
      else{
         return null;
      }
   }
   return rect;
}

export const getSelection = () => {
   let t = '';
   if (window.getSelection) {
     t = window.getSelection();
   } else if (document.getSelection) {
     t = document.getSelection();
   } else if (document.selection) {
     t = document.selection.createRange().text;
   }
   return t;
}


export const getSelectedBlockNode = (root) => {
  const selection = root.getSelection();
  if (selection.rangeCount == 0) {
    return null;
  }
  window.sel = selection;
  let node = selection.getRangeAt(0).startContainer;
  // console.log(node);
  do {
    if (node.getAttribute && node.getAttribute('data-block') === 'true') {
      return node;
    }
    node = node.parentNode;
    // console.log(node);
  } while(node !== null);
  return null;
};


export const getCurrentBlock = (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  return block;
};
