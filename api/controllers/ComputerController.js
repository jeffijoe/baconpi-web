/**
 * ComputerController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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
/*global Computer, AgentService*/
'use strict';
var _ = require('lodash'),
  Q = require('q');
  
var ComputerController = {
  /**
   * Scoped find for computers being managed by the specified agent.
   */
  findComputersByAgentId: function(req, res) {
    Computer.find().where({
      agentId: req.param('agentId')
    }).exec(function(err, computers) {
      if (err) throw err;
      res.json(computers);
    });
  },

  /**
   * Creates a new computer, and assigns its agent.
   */
  createScopedComputer: function(req, res) {
    console.log('enter');
    var agentId = req.param('agentId');
    AgentService.getAgentById(agentId).then(function(agent) {
      if (!agent) return res.notFound('Agent not found.');
      var computer = _.extend(req.body, {
        agentId: agentId
      });
      return Q(Computer.create(computer));
    }).then(function(computer) {
      console.log('saved');
      return res.json(computer);
    }).fail(function(err) {
      if (err.ValidationError)
        return res.badRequest(err);
      res.serverError(err);
      throw err;
    }).done();
  },

  /**
   * Sets the computers agent, as well as saving it.
   */
  setComputerAgent: function(req, res) {
    var id = req.param('id');
    Q(Computer.findOne(id)).then(function(computer) {
      if (!computer) return res.notFound();
      var agentId = req.param('agentId');
      // Returns a promise.
      return AgentService.getAgentById(agentId).then(function(agent) {
        if (!agent)
          return res.notFound('Agent not found.');

        _.extend(computer, req.body, {
          agentId: agentId
        });
        return Q.nfcall(computer.save.bind(computer));
      });
    }).then(function(computer) {
      res.json(computer);
    }).fail(function(err) {
      if (err.ValidationError)
        return res.badRequest(err);
      res.serverError(err);
      throw err;
    }).done();
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ComputerController)
   */
  _config: {}


};
module.exports = ComputerController;
