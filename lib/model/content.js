'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _link = require('../components/entities/link');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultDecorators = new _draftJs.CompositeDecorator([{
  strategy: _link.findLinkEntities,
  component: _link2.default
}]);

var createEditorState = function createEditorState() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var decorators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDecorators;

  if (content === null) {
    return _draftJs.EditorState.createEmpty(decorators);
  }
  return _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(content), decorators);
};

exports.default = createEditorState;