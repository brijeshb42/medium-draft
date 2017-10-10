'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLinkEntities = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../../util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findLinkEntities = exports.findLinkEntities = function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === _constants.Entity.LINK;
  }, callback);
};

var Link = function Link(props) {
  var contentState = props.contentState,
      entityKey = props.entityKey;

  var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
      url = _contentState$getEnti.url;

  return _react2.default.createElement(
    'a',
    {
      className: 'md-link',
      href: url,
      rel: 'noopener noreferrer',
      target: '_blank',
      'aria-label': url
    },
    props.children
  );
};

Link.propTypes = {
  children: _propTypes2.default.node,
  entityKey: _propTypes2.default.string,
  contentState: _propTypes2.default.object.isRequired
};

exports.default = Link;