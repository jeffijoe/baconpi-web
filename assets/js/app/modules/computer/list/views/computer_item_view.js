/**
 * Computer Item View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/computer/list/templates/computer_item_template'
], function($, _, Backbone, Marionette, App, template) {
  return Marionette.ItemView.extend({
    template: template,
    el: '<div class="computer ui segment">',
    ui: {
      edit: '.edit.button',
      destroy: '.delete.button',
      wake: '.awake.button',
      wakingDimmer: '.waking.dimmer'
    },
    triggers: {
      'click @ui.wake': 'wake:computer',
      'click @ui.edit': 'edit:computer',
      'click @ui.destroy': 'delete:computer'
    },
    modelEvents: {
      'before:signal:send': 'showWakingDimmer',
    },
    initialize: function () {
      this.listenTo(App.vent, 'waker:signal:send', this.hideWakingDimmer);
      this.listenTo(App.vent, 'waker:signal:error', this.hideWakingDimmer);
    },
    showWakingDimmer: function() {
      this.ui.wakingDimmer.addClass('active');
    },
    hideWakingDimmer: function(data) {
      if(this.signalIsForThisComputer(data))
        this.ui.wakingDimmer.removeClass('active');
    },
    signalIsForThisComputer: function (data) {
      return this.model.get('macAddress') === data.mac;
    }
  });
});
