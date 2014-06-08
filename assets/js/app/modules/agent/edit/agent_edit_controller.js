/**
 * Agent Edit Controller
 */
'use strict';
define(['jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/agent/edit/views/agent_edit_view',
  'models/agent_model'
], function($, _, Backbone, Marionette, App, AgentEditView, Agent) {
  return Marionette.Controller.extend({
    initialize: function() {
      _.bindAll(this, 'editAgent', '_save', '_cancel', '_notifyOnSuccess', '_notifyOnFailure');
    },
    editAgentById: function(agentId) {
      App.entities.agents.getById(agentId).then(this.editAgent);
    },
    editAgent: function(agent) {
      var view = this._createEditView({
        model: agent
      });

      App.content.show(view);
    },
    addAgent: function() {
      var agent = new Agent();
      var view = this._createEditView({
        model: agent
      });
      
      this.listenToOnce(this, 'edit:agent:save', function() {
        App.entities.agents.add(agent);
      });
      this.listenToOnce(this, 'edit:agent:save:fail', function() {
        App.entities.agents.remove(agent);
      });
      App.content.show(view);
    },
    _createEditView: function(viewOptions) {
      var view = new AgentEditView(viewOptions);
      var that = this;
      this.stopListening(this);
      this.listenTo(view, 'edit:agent:save', this._save);
      this.listenTo(view, 'edit:agent:cancel', this._cancel);
      this.listenTo(view, 'close', function() {
        that.stopListening(view);
      });
      return view;
    },
    _save: function(agent) {
      var that = this;
      agent.save().then(this._notifyOnSuccess, function(xhr) {
        agent.revert();
        that._notifyOnFailure(xhr);
      });
      this.trigger('edit:agent:save', agent);
    },
    _cancel: function() {
      this.trigger('edit:agent:cancel');
    },
    _notifyOnSuccess: function() {
      this.trigger('edit:agent:save:success');
    },
    _notifyOnFailure: function(xhr) {
      this.trigger('edit:agent:save:fail', xhr);
    }
  });
});
