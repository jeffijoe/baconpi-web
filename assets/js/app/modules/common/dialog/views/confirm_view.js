/**
 * Confirm View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/common/dialog/views/dialog_view',
  'modules/common/dialog/templates/confirm_template'
], function($, _, Backbone, Marionette, DialogView, template) {
  return DialogView.extend({
    template: template,
    events: {
      'click .ok.button': '_ok',
      'click .cancel.button, .close.icon': '_cancel'
    },
    serializeData: function() {
      return {
        title: this.options.title || 'Confirm',
        content: this.options.content || 'Please confirm',
        ok: this.options.ok || 'OK',
        cancel: this.options.cancel || 'Cancel'
      };
    },
    onRender: function() {
      this.$('.ok').addClass(this.options.okClass || 'positive');
    },
    _ok: function() {
      this.hideDialog(true);
    },
    _cancel: function() {
      this.hideDialog(false);
    }
  });
});
