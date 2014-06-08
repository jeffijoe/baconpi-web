/**
 * Agent Show Controller
 */
'use strict';
define(['jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/agent/show/views/agent_show_view',
  'collections/computers_collection'
], function($, _, Backbone, Marionette, App, AgentShowView, ComputersCollection) {
  return Marionette.Controller.extend({
    initialize: function() {
      _.bindAll(this, 'showAgentById', 'showAgent');
    },
    showAgentById: function(agentId) {
      App.entities.agents.getById(agentId).then(this.showAgent);
    },
    showAgent: function(agent) {
      var view = new AgentShowView({
        model: agent
      });
      this.listenTo(view, 'add:computer', function () {
        App.vent.trigger('add:computer', agent);
      });
      this.listenTo(view, 'edit:agent', this._editAgent);
      this.listenTo(view, 'close', function() {
        this.stopListening(view);
      });
      App.content.show(view);

      this._getComputerListController(agent).then(function(computerListController) {
        view.computers.show(computerListController.getCollectionView());  
      });
    },
    _editAgent: function(agent) {
      var func = function() {
        App.vent.trigger('show:agent', agent);
      };
      App.vent.trigger('edit:agent', agent, {
        save: func,
        cancel: func
      });
    },
    _getComputerListController: function(agent) {
      var collection = new ComputersCollection([], {
        scope: agent
      });
      var controller = App.request('computerListController', {
        collection: collection
      });
      return collection.fetch().then(function () {
        return controller;
      });
    }
  });
});
