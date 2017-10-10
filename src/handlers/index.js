import onTab from './onTab';
import onUpArrow from './onUpArrow';
import handlePastedText from './handlePastedText';
import handleReturn from './handleReturn';
import handleKeyCommand from './handleKeyCommand';
import handleBeforeInput from './handleBeforeInput';
import blockRendererFn from './blockRendererFn';
import blockStyleFn from './blockStyleFn';
import keyBindingFn from './keyBindingFn';


const defaultPlugins = {
  onTab,
  onUpArrow,
  handlePastedText,
  handleReturn,
  handleKeyCommand,
  handleBeforeInput,
  blockRendererFn,
  blockStyleFn,
  keyBindingFn,
};


export default defaultPlugins;
