'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _model = require('../../model/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import './todo.scss';

var TodoBlock = function (_React$Component) {
  _inherits(TodoBlock, _React$Component);

  function TodoBlock(props) {
    _classCallCheck(this, TodoBlock);

    var _this = _possibleConstructorReturn(this, (TodoBlock.__proto__ || Object.getPrototypeOf(TodoBlock)).call(this, props));

    _this.updateData = _this.updateData.bind(_this);
    return _this;
  }

  _createClass(TodoBlock, [{
    key: 'updateData',
    value: function updateData() {
      var _props = this.props,
          block = _props.block,
          blockProps = _props.blockProps;
      var setEditorState = blockProps.setEditorState,
          getEditorState = blockProps.getEditorState;

      var data = block.getData();
      var checked = data.has('checked') && data.get('checked') === true;
      var newData = data.set('checked', !checked);
      setEditorState((0, _model.updateDataOfBlock)(getEditorState(), block, newData));
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.props.block.getData();
      var checked = data.get('checked') === true;
      return _react2.default.createElement(
        'div',
        { className: checked ? 'block-todo-completed' : '' },
        _react2.default.createElement(
          'span',
          { contentEditable: false },
          _react2.default.createElement('input', { type: 'checkbox', checked: checked, onChange: this.updateData })
        ),
        _react2.default.createElement(_draftJs.EditorBlock, this.props)
      );
    }
  }]);

  return TodoBlock;
}(_react2.default.Component);

exports.default = TodoBlock;


TodoBlock.propTypes = {
  block: _propTypes2.default.object,
  blockProps: _propTypes2.default.object
};