/**
 * Computer Edit View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/computer/edit/templates/computer_edit_template'
], function($, _, Backbone, Marionette, App, template) {
  return Marionette.ItemView.extend({
    template: template,
    behaviors: {
      DeviceEditor: {
        formValidation: {
          name: {
            identifier: 'name',
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
      name: '#name',
      macAddress: '#macAddress',
      agent: '#agentId'
    },
    serializeData: function () {
      var data = App.Behaviors.DeviceEditor.prototype.serializeData.call(this);
      data.items = App.entities.agents.toJSON();
      return data;
    },
    onDomRefresh: function () {
      this.$el.find('.dropdown').dropdown();
    },
    onClose: function () {
      this.$el.find('dropdown').dropdown('destroy');
    },
    onCancel: function() {
      this.trigger('edit:computer:cancel');
    },
    onSave: function() {
      this.model.set({
        name: this.ui.name.val(),
        macAddress: this.ui.macAddress.val(),
        agentId: this.ui.agent.val()
      });
      this.trigger('edit:computer:save', this.model);
    }
  });
});
