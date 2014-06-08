/**
 * Agent List View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/agent/list/views/agent_list_item_view',
  'modules/agent/list/templates/agent_list_template'
], function($, _, Backbone, Marionette, AgentListItemView, template) {
  return Marionette.CompositeView.extend({
    template: template,
    itemView: AgentListItemView,
    itemViewContainer: '#agents',
    ui: {
      'btnAdd':'.ui.add.button'
    },
    events: {
      'click @ui.btnAdd': 'addAgent'
    },
    onBeforeItemAdded: function(itemView) {
      this.listenTo(itemView, 'show:agent', this.showAgent);
      this.listenTo(itemView, 'edit:agent', this.editAgent);
      this.listenTo(itemView, 'delete:agent', this.deleteAgent);
      var that = this;
      this.listenTo(itemView, 'close', function () {
        that.stopListening(itemView);
      });
    },
    addAgent: function () {
      this.trigger('add:agent');
    },
    showAgent: function(agent) {
      this.trigger('show:agent', agent);
    },
    editAgent: function (agent) {
      this.trigger('edit:agent', agent);
    },
    deleteAgent: function (agent) {
      this.trigger('delete:agent', agent);
    }
  });
});
