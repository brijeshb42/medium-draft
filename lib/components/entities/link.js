'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLinkEntities = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _constants = require('../../util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findLinkEntities = exports.findLinkEntities = function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && _draftJs.Entity.get(entityKey).getType() === _constants.Entity.LINK;
  }, callback);
};

var Link = function Link(props) {
  var _Entity$get$getData = _draftJs.Entity.get(props.entityKey).getData(),
      url = _Entity$get$getData.url;

  return _react2.default.createElement(
    'a',
    {
      className: 'md-link hint--top hint--rounded',
      href: url,
      rel: 'noopener noreferrer',
      target: '_blank',
      'aria-label': url
    },
    props.children
  );
};

Link.propTypes = {
  children: _react.PropTypes.node,
  entityKey: _react.PropTypes.string
};

exports.default = Link;