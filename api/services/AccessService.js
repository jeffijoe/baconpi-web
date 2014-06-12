/**
 * Access service
 */
'use strict';
var Q = require('q');
module.exports = {
  check: function (repository, userId, entityId) {
    return Q(repository.findOne(entityId)).then(function (entity) {
      if(!entity)
        return false;
      if(entity.userId !== userId)
        return false;
      return entity;
    });
  }
};