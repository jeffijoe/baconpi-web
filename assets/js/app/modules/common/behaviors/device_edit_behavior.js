/**
 * Device Edit Behavior
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app'
], function($, _, Backbone, Marionette, App) {
  App.Behaviors.DeviceEditor = Marionette.Behavior.extend({
    ui: {
      'form': '.ui.form',
      'cancel': '.ui.cancel.button',
      'save': '.ui.save.button'
    },
    events: {
      'click @ui.cancel': 'cancelEdit',
      'click @ui.save': 'save',
      'keyup input[type="text"]': 'inputKeyPress'
    },
    inputKeyPress: function(e) {
      if (e.which === 13)
        this.save();
    },
    onRender: function() {
      this.ui.form.form(this.options.formValidation, {
        on: 'blur',
        debug: false,
        inline: true
      });
    },
    serializeData: function() {
      if (!this.model)
        return {};
      var json = this.model.toJSON();
      json.isNew = this.model.isNew();
      return json;
    },
    onClose: function() {
      this.ui.form.form('destroy');
    },
    cancelEdit: function() {
      this.view.triggerMethod('cancel');
    },
    validate: function() {
      var result = this.ui.form.form('validate form');
      return result;
    },
    save: function() {
      if (!this.validate())
        return;

      this.view.triggerMethod('save');
    }
  });
});
