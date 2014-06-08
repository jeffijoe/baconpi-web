/**
 * Agent Module
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'collections/agents_collection',
  'models/agent_model',
  'modules/agent/list/agent_list_controller',
  'modules/agent/show/agent_show_controller',
  'modules/agent/edit/agent_edit_controller',
], function($, _, Backbone, Marionette, App, Agents, Agent, AgentListController, AgentShowController, AgentEditController) {
  App.module('AgentsModule', function(AgentsModule, App) {
    AgentsModule.startWithParent = false;
    var listController = new AgentListController();
    var editController = new AgentEditController();
    var showController = new AgentShowController();
    
    var startModule = function () {
      App.startModule('AgentsModule');
    };
    
    AgentsModule.onStart = function() {
      console.log('Agents module started.');
    };

    AgentsModule.onStop = function() {
      console.log('Agents Module stopped.');
      API.stopListening();
    };

    var AgentRouter = Marionette.AppRouter.extend({
      onRoute: function () {
        startModule();
      },
      appRoutes: {
        'agents(/)': 'listAgents',
        'agents/new(/)': 'addAgent',
        'agents/:id(/)': 'showAgent',
        'agents/:id/edit(/)': 'editAgent'
      }
    });

    var RouteController = Marionette.Controller.extend({
      initialize: function() {

      },
      listAgents: function() {
        this.stopListening(listController);
        listController.listAgents();
        this.listenTo(listController, 'delete:agent:success', this._agentDeleteSuccess);
        this.listenTo(listController, 'add:agent', this._addAgent);
        this.listenTo(listController, 'edit:agent', this._editAgent);
        this.listenTo(listController, 'show:agent', this._showAgent);
      },
      showAgent: function(id) {
        showController.showAgentById(id);
      },
      addAgent: function(options) {
        this._setupEditEvents(options);
        editController.addAgent();
      },
      editAgent: function(id, options) {
        this._setupEditEvents(options);
        editController.editAgentById(id);
      },
      _setupEditEvents: function (options) {
        options = options || {
          save: this._defaultEditCallback,
          cancel: this._defaultEditCallback
        };
        this.stopListening(editController);
        this.listenTo(editController, 'edit:agent:save', options.save);
        this.listenTo(editController, 'edit:agent:cancel', options.cancel);
        this.listenTo(editController, 'edit:agent:save:success', this._agentSaveSuccess);
        this.listenTo(editController, 'edit:agent:save:fail', this._agentSaveFailed);
      },
      _addAgent: function() {
        App.vent.trigger('add:agent');
      },
      _editAgent: function(agent) {
        App.vent.trigger('edit:agent', agent);
      },
      _showAgent: function(agent) {
        App.vent.trigger('show:agent', agent);
      },
      _defaultEditCallback: function() {
        App.vent.trigger('list:agents');
      },
      _agentSaveSuccess: function() {
        App.execute('showSuccessMessage', {
          title: 'Success!',
          message: 'Agent was saved successfully. Feels good when shit just works, doesen\'t it?',
          autoHide: 2000
        });
      },
      _agentSaveFailed: function(xhr) {
        App.execute('showErrorMessage', {
          title: 'Yeeaaah... nooo.. yeaah noo..... yeaaah..... nooooo...',
          message: 'Something went wrong.. You are free to try again. '
        });
      },
      _agentDeleteSuccess: function() {
        App.execute('showSuccessMessage', {
          title: 'Deleted!',
          message: 'aaaaaaaand it\'s gone!',
          autoHide: 1200
        });
      }
    });

    App.vent.on('list:agents', function() {
      startModule();
      API.listAgents();
      App.navigate('/agents');
    });

    App.vent.on('add:agent', function(options) {
      startModule();
      API.addAgent(options);
      App.navigate('/agents/new');
    });

    App.vent.on('show:agent', function(agent) {
      startModule();
      var id;
      if(_.isObject(agent))
        id = agent.id;
      else
        id = agent;
      API.showAgent(id);
      App.navigate('/agents/' + id);
    });

    App.vent.on('edit:agent', function(agent, options) {
      startModule();
      API.editAgent(agent.id, options);
      App.navigate('agents/' + agent.id + '/edit');
    });

    var API = new RouteController();
    App.addInitializer(function() {
      new AgentRouter({
        controller: API
      });
    });
  });

  return App.AgentsModule;
});
