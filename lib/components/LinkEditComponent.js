'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getRelativeParent = function getRelativeParent(element) {
  if (!element) {
    return null;
  }

  var position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

var LinkEditComponent = function (_React$Component) {
  _inherits(LinkEditComponent, _React$Component);

  function LinkEditComponent(props) {
    _classCallCheck(this, LinkEditComponent);

    var _this = _possibleConstructorReturn(this, (LinkEditComponent.__proto__ || Object.getPrototypeOf(LinkEditComponent)).call(this, props));

    _this.calculatePosition = function () {
      if (!_this.toolbar) {
        return;
      }
      var relativeParent = getRelativeParent(_this.toolbar.parentElement);
      var relativeRect = relativeParent ? relativeParent.getBoundingClientRect() : window.document.body.getBoundingClientRect();
      var selectionRect = (0, _draftJs.getVisibleSelectionRect)(window);
      if (!selectionRect) {
        return;
      }
      var position = {
        top: selectionRect.top - relativeRect.top + 35,
        left: selectionRect.left - relativeRect.left + selectionRect.width / 2,
        transform: 'translate(-50%) scale(1)'
      };
      _this.setState({ position: position });
    };

    _this.removeLink = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.props.removeLink(_this.props.blockKey, _this.props.entityKey);
    };

    _this.editLink = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.props.editLink(_this.props.blockKey, _this.props.entityKey);
    };

    _this.state = {
      position: {}
    };
    _this.renderedOnce = false;
    return _this;
  }

  _createClass(LinkEditComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      setTimeout(this.calculatePosition, 0);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(newProps) {
      if (this.renderedOnce) {
        var ret = this.props.blockKey !== newProps.blockKey || this.props.entityKey !== newProps.entityKey;
        if (ret) {
          this.renderedOnce = false;
        }
        return ret;
      }
      this.renderedOnce = true;
      return true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      setTimeout(this.calculatePosition, 0);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var url = this.props.url;
      if (url.length > 30) {
        url = url.slice(0, 30) + '...';
      }
      return _react2.default.createElement(
        'div',
        {
          className: 'md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link',
          style: this.state.position,
          ref: function ref(element) {
            _this2.toolbar = element;
          }
        },
        _react2.default.createElement(
          'a',
          { href: this.props.url, title: this.props.url, target: '_blank', rel: 'noopener noreferrer' },
          url
        ),
        _react2.default.createElement(
          'button',
          { className: 'md-editor-toolbar-unlink-button', onClick: this.removeLink },
          'Unlink'
        ),
        _react2.default.createElement(
          'button',
          { className: 'md-editor-toolbar-edit-button', onClick: this.editLink },
          'Edit'
        )
      );
    }
  }]);

  return LinkEditComponent;
}(_react2.default.Component);

LinkEditComponent.propTypes = {
  editorState: _propTypes2.default.object.isRequired,
  url: _propTypes2.default.string.isRequired,
  blockKey: _propTypes2.default.string.isRequired,
  entityKey: _propTypes2.default.string.isRequired,
  removeLink: _propTypes2.default.func.isRequired,
  editLink: _propTypes2.default.func.isRequired
};
exports.default = LinkEditComponent;