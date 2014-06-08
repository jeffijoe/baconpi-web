/**
 * Semantic UI validation behavior
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'semantic'
], function($, _, Backbone, Marionette, App) {
  App.Behaviors.SemanticValidation = Marionette.Behavior.extend({
    initialize: function () {
      this.view.validate = this.validate;
    },
    onRender: function() {
      this.view.form = this.view.$el.find(this.options.form);
      this.view.form.form(this.options.validation, {
        on: 'blur',
        debug: false,
        inline: true
      });
    },
    onClose: function() {
      this.view.form.form('destroy');
    },
    validate: function() {
      var result = this.form.form('validate form');
      this.triggerMethod('validate', result);
      return result;
    },
  });
});
