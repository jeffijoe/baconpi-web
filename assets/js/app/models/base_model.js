/**
 * Base Model
 */
'use strict';
define(['jquery', 'lodash', 'backbone', 'marionette', 'app'], function($, _, Backbone, Marionette, App) {
  return Backbone.Model.extend({
    revert: function () {
      this.set(this.previousAttributes());
    },
    initialize: function () {
      this.listenTo(this, 'error', this._handleError);
    },
    _handleError: function (model, xhr, options) {
        App.execute('showModelError', model, xhr, options);
    }
  });
});
