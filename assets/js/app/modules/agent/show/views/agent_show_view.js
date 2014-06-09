/**
 * Agent Show View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/agent/show/templates/agent_show_template'
], function($, _, Backbone, Marionette, App, template) {
  return Marionette.Layout.extend({
    template: template,
    ui: {
      btnEdit: '.edit.button',
      btnAdd: '.add.button'
    },
    events: {
      'click @ui.btnEdit': 'editAgent',
      'click @ui.btnAdd': 'addAgent'
    },
    modelEvents: {
      'change:connected': 'setConnectivity'
    },
    regions: {
      computers: '#computer-list'
    },
    addAgent: function () {
      this.trigger('add:computer');
    },
    editAgent: function() {
      this.trigger('edit:agent', this.model);
    },
    onRender: function () {
      this.setConnectivity(this.model);
    },
    setConnectivity: function (agent) {
      if(!agent.get('connected')) {
        this.$el.find('.connectivity').addClass('hidden');
      } else {
        this.$el.find('.connectivity').removeClass('hidden');
      }
    }
  });
});
