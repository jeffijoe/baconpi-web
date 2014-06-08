/*global Agent*/
'use strict';
var Q = require('q');
module.exports = {
  getAgentById: function (agentId) {
    var d = Q.defer();
    Agent.findOne(agentId, function(err, agent) {
      if (err) throw err;
      d.resolve(agent);
    });
    d.promise.fail(function (err) {
      throw err;
    });
    return d.promise;
  }
};