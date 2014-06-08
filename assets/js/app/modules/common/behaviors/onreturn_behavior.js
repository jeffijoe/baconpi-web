/**
 * OnReturn Behavior
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app'
], function($, _, Backbone, Marionette, App) {
  App.Behaviors.OnReturn = Marionette.Behavior.extend({
    initialize: function (options) {
      var events = {};
      this.events = this.events || {};
      events['keyup '+options.selector] = '_handlePotentialReturnKey';
      _.extend(this.events, events);
      this._handlePotentialReturnKey = _.bind(this._handlePotentialReturnKey, this);
    },
    _handlePotentialReturnKey: function(e) {
      if (e.which === 13)
        this.options.method.call(this.view);
    }
  });
});
