/**
 * AgentController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
/*global AccessService, Agent, Computer, _*/
'use strict';
var Q = require('q');

module.exports = {
    
  update: function (req, res) {
    var data = _.clone(req.body);
    AccessService.check(Agent, req.session.userId, req.param('id')).then(function (result) {
      if(result === false)
        return res.forbidden();
      
      delete data.userId;
      _.extend(result, data);
      return Q.nfcall(result.save.bind(result)).then(function () {
        res.json(result);
      });
    }).fail(function (err) {
      res.serverError(err);
    });
  },
  
  destroy: function (req, res) {
    var userId = req.session.userId;
    var agentId = req.param('id');
    AccessService.check(Agent, userId, agentId).then(function (result) {
      if(result === false)
        return res.forbidden();
      
      return Computer.destroy({userId: userId, agentId: agentId}).then(function () {
        return Q.nfcall(result.destroy.bind(result));
      }).then(function () {
        res.json(result);
      });
      
    }).fail(function (err) {
      res.serverError(err);
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AgentController)
   */
  _config: {}

  
};
