/**
 * Dropdown Behavior
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app'
], function($, _, Backbone, Marionette, App) {
  App.Behaviors.Dropdown = Marionette.Behavior.extend({
    onDomRefresh: function() {
      this.$('.ui.dropdown').dropdown();
    },
    onBeforeClose: function() {
      this.$('.ui.dropdown').dropdown('destroy');
    },
  });
});
