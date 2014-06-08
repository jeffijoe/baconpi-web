/**
 * Agent Editor View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/agent/edit/templates/agent_edit_template'
], function($, _, Backbone, Marionette, App, template) {
  return Marionette.ItemView.extend({
    template: template,
    behaviors: {
      DeviceEditor: {
        formValidation: {
          deviceName: {
            identifier: 'deviceName',
            rules: [{
              type: 'empty',
              prompt: 'Please enter a device name.'
            }]
          },
          macAddress: {
            identifier: 'macAddress',
            rules: [{
              type: 'empty',
              prompt: 'Please enter this device\'s mac address.'
            }]
          }
        }
      }
    },
    ui: {
      form: '.ui.form',
      cancel: '.ui.cancel.button',
      save: '.ui.save.button',
      deviceName: '#deviceName',
      macAddress: '#macAddress'
    },
    serializeData: function () {
      var data = App.Behaviors.DeviceEditor.prototype.serializeData.call(this);
      return data;
    },
    onCancel: function() {
      this.trigger('edit:agent:cancel');
    },
    onSave: function() {
      this.model.set({
        deviceName: this.ui.deviceName.val(),
        macAddress: this.ui.macAddress.val()
      });
      this.trigger('edit:agent:save', this.model);
    }
  });
});
