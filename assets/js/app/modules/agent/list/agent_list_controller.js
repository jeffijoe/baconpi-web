/**
 * Agent List Controller
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/agent/list/views/agent_list_view',
  'modules/common/dialog/dialog_module'
], function($, _, Backbone, Marionette, App, AgentsListView, Dialog) {
  return Marionette.Controller.extend({
    initialize: function() {
      _.bindAll(this, '_showList', 'listAgents', 'addAgent', '_onDeleteSuccess');
    },
    listAgents: function() {
      this._showList();
    },
    addAgent: function() {
      this.trigger('add:agent');
    },
    showAgent: function(agent) {
      this.trigger('show:agent', agent);
    },
    editAgent: function(agent) {
      this.trigger('edit:agent', agent);
    },
    deleteAgent: function(agent) {
      var that = this;
      Dialog.confirm({
        title: 'Delete ' + agent.get('deviceName') + '?',
        content: 'Are you really sure you want to delete this agent?',
        ok: 'Delete',
        cancel: ' Cancel',
        okClass: 'negative'
      }).ok(function() {
        agent.destroy({restoreOnFail: true}).then(that._onDeleteSuccess, function (xhr) {
          that._onDeleteFail(xhr);
        });
      });
    },
    _onDeleteSuccess: function() {
      this.trigger('delete:agent:success');
    },
    _onDeleteFail: function(xhr) {
      this.trigger('delete:agent:fail', xhr);
    },
    _showList: function() {
      var view = new AgentsListView({
        collection: App.entities.agents
      });
      var that = this;
      this.listenTo(view, 'add:agent', this.addAgent);
      this.listenTo(view, 'show:agent', this.showAgent);
      this.listenTo(view, 'edit:agent', this.editAgent);
      this.listenTo(view, 'delete:agent', this.deleteAgent);
      this.listenTo(view, 'close', function() {
        that.stopListening(view);
      });
      App.content.show(view);
    }
  });
});
