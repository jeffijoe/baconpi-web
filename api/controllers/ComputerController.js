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
/*global Computer, AgentService, AccessService, Agent*/
'use strict';
var _ = require('lodash'),
  Q = require('q');


/**
 * Helper method for creating a computer, regardless of route.
 */
function _create(req, res, agentId) {
  AccessService.check(Agent, req.session.userId, agentId).then(function(agent) {
    if (agent === false) {
      res.forbidden();
      throw false;
    }

    if (!agent) {
      res.notFound('Agent not found.');
      throw false;
    }
    var computer = _.extend(req.body, {
      agentId: agentId
    });
    return Q(Computer.create(computer));
  }).then(function(computer) {
    return res.json(computer);
  }).fail(function(err) {
    if(err === false) 
      return;
    if (err.ValidationError)
      return res.badRequest(err);
    res.serverError(err);
    throw err;
  }).done();
}

/**
 * Helper method for updating a computer, regardless of route.
 */
function _update(req, res, agentId) {
    var id = req.param('id');
    AccessService.check(Computer, req.session.userId, id).then(function(computer) {
      if (computer === false) {
        res.forbidden();
        throw false;
      }

      if (!computer) {
        res.notFound();
        throw false;
      }
      
      // Returns a promise.
      return AgentService.getAgentById(agentId).then(function(agent) {
        if (!agent)
          return res.notFound('Agent not found.');
        delete req.body.userId;
        _.extend(computer, req.body, {
          agentId: agentId
        });
        return Q.nfcall(computer.save.bind(computer));
      });
    }).then(function(computer) {
      res.json(computer);
    }).fail(function(err) {
      if (err === false)
        return;

      if (err.ValidationError)
        return res.badRequest(err);
      res.serverError(err);
      throw err;
    }).done();
}


var ComputerController = {
  /**
   * Scoped find for computers being managed by the specified agent.
   */
  findComputersByAgentId: function(req, res) {
    Computer.find().where({
      agentId: req.param('agentId'),
      userId: req.session.userId
    }).exec(function(err, computers) {
      if (err) throw err;
      res.json(computers);
    });
  },

  /**
   * Create
   */
  create: function(req, res) {
    var agentId = req.body.agentId;
    _create(req, res, agentId);
  },

  /**
   * Creates a new computer, and assigns its agent.
   */
  createScopedComputer: function(req, res) {
    var agentId = req.param('agentId');
    _create(req, res, agentId);
  },
  
  /**
   * Update
   */
  update: function (req, res) {
    var agentId = req.body.agentId;
    _update(req, res, agentId);
  },
  
  /**
   * Sets the computers agent, as well as saving it.
   */
  scopedUpdate: function(req, res) {
    var agentId = req.param('agentId');
    _update(req, res, agentId);
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ComputerController)
   */
  _config: {}


};
module.exports = ComputerController;
