/**
 * Agent List Item View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/agent/list/templates/agent_list_item_template'
], function($, _, Backbone, Marionette, template) {
  return Marionette.ItemView.extend({
    template: template,
    className: 'item',
    ui: {
      'open': '.open',
      'edit': '.edit',
      'delete': '.delete'
    },
    modelEvents: {
      change: 'render'
    },
    events: {
      'click @ui.open': '_showAgent',
      'click @ui.edit': '_editAgent',
      'click @ui.delete': '_deleteAgent',
    },
    onBeforeClose: function() {
      this.$('.ui.dropdown').dropdown('destroy');
    },
    onShow: function () {
      this.$('.ui.dropdown').dropdown();
    },
    _showAgent: function () {
      this.trigger('show:agent', this.model);
    },
    _editAgent: function () {
      this.trigger('edit:agent', this.model);
    },
    _deleteAgent: function () {
      this.trigger('delete:agent', this.model);
    }
  });
});
