'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRenderOptions = exports.options = exports.entityToHTML = exports.blockToHTML = exports.styleToHTML = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftConvert = require('draft-convert');

var _constants = require('./util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleToHTML = exports.styleToHTML = function styleToHTML(style) {
  switch (style) {
    case _constants.Inline.ITALIC:
      return _react2.default.createElement('em', { className: 'md-inline-' + style.toLowerCase() });
    case _constants.Inline.BOLD:
      return _react2.default.createElement('strong', { className: 'md-inline-' + style.toLowerCase() });
    case _constants.Inline.STRIKETHROUGH:
      return _react2.default.createElement('strike', { className: 'md-inline-' + style.toLowerCase() });
    case _constants.Inline.UNDERLINE:
      return _react2.default.createElement('u', { className: 'md-inline-' + style.toLowerCase() });
    case _constants.Inline.HIGHLIGHT:
      return _react2.default.createElement('span', { className: 'md-inline-' + style.toLowerCase() });
    case _constants.Inline.CODE:
      return _react2.default.createElement('code', { className: 'md-inline-' + style.toLowerCase() });
    default:
      return null;
  }
};

var blockToHTML = exports.blockToHTML = function blockToHTML(block) {
  var blockType = block.type;
  switch (blockType) {
    case _constants.Block.H1:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return _react2.default.createElement('h1', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.H2:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return _react2.default.createElement('h2', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.H3:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return _react2.default.createElement('h3', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.H4:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return _react2.default.createElement('h4', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.H5:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return _react2.default.createElement('h5', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.H6:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return _react2.default.createElement('h6', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.BLOCKQUOTE_CAPTION:
    case _constants.Block.CAPTION:
      return {
        start: '<p class="md-block-' + blockType.toLowerCase() + '"><caption>',
        end: '</caption></p>'
      };
    case _constants.Block.IMAGE:
      {
        var imgData = block.data;
        var text = block.text;
        var extraClass = text.length > 0 ? ' md-block-image-has-caption' : '';
        return {
          start: '<figure class="md-block-image' + extraClass + '"><img src="' + imgData.src + '" alt="' + block.text + '" /><figcaption className="md-block-image-caption">',
          end: '</figcaption></figure>'
        };
      }
    case _constants.Block.ATOMIC:
      return {
        start: '<figure className="md-block-' + blockType.toLowerCase() + '">',
        end: '</figure>'
      };
    case _constants.Block.TODO:
      {
        var checked = block.data.checked || false;
        var inp = '';
        var containerClass = '';
        if (checked) {
          inp = '<input type=checkbox disabled checked="checked" />';
          containerClass = 'md-block-todo-checked';
        } else {
          inp = '<input type=checkbox disabled />';
          containerClass = 'md-block-todo-unchecked';
        }
        return {
          start: '<div class="md-block-' + blockType.toLowerCase() + ' ' + containerClass + '">' + inp + '<p>',
          end: '</p></div>'
        };
      }
    case _constants.Block.BREAK:
      return _react2.default.createElement('hr', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.BLOCKQUOTE:
      return _react2.default.createElement('blockquote', { className: 'md-block-' + blockType.toLowerCase() });
    case _constants.Block.OL:
      return {
        element: _react2.default.createElement('li', null),
        nest: _react2.default.createElement('ol', { className: 'md-block-' + blockType.toLowerCase() })
      };
    case _constants.Block.UL:
      return {
        element: _react2.default.createElement('li', null),
        nest: _react2.default.createElement('ul', { className: 'md-block-' + blockType.toLowerCase() })
      };
    case _constants.Block.UNSTYLED:
      if (block.text.length < 1) {
        return _react2.default.createElement(
          'p',
          { className: 'md-block-' + blockType.toLowerCase() },
          _react2.default.createElement('br', null)
        );
      }
      return _react2.default.createElement('p', { className: 'md-block-' + blockType.toLowerCase() });
    default:
      return null;
  }
};

var entityToHTML = exports.entityToHTML = function entityToHTML(entity, originalText) {
  if (entity.type === _constants.Entity.LINK) {
    return _react2.default.createElement(
      'a',
      {
        className: 'md-inline-link',
        href: entity.data.url,
        target: '_blank',
        rel: 'noopener noreferrer'
      },
      originalText
    );
  }
  return originalText;
};

var options = exports.options = {
  styleToHTML: styleToHTML,
  blockToHTML: blockToHTML,
  entityToHTML: entityToHTML
};

var setRenderOptions = exports.setRenderOptions = function setRenderOptions() {
  var htmlOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options;
  return (0, _draftConvert.convertToHTML)(htmlOptions);
};

exports.default = function (contentState) {
  var htmlOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options;
  return (0, _draftConvert.convertToHTML)(htmlOptions)(contentState);
};