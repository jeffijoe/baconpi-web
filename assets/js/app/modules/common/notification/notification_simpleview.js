/**
 *  Notification Simple View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/common/notification/templates/notification_simpleview'
], function($, _, Backbone, Marionette, template) {
  return Marionette.ItemView.extend({
    template: template,
    el: '<div class="content">',
    ui: {
      'icon': 'i.icon'
    },
    iconClasses: {
      'success': 'green check',
      'info': 'blue info',
      'error': 'red warning'
    },
    initialize: function(options) {
      _.extend(this, options);
    },
    onRender: function() {
      var type = this.iconClasses[this.type || 'info'];
      this.ui.icon.addClass(type);
    },
    onDomRefresh: function() {
      var that = this;
      var delay = 600;
      var dimmer = this.$el.parent();
      var timeoutHandle = null;
      dimmer.dimmer({
        onHide: function() {
          if(timeoutHandle)
            clearTimeout(timeoutHandle);
          setTimeout(function() {
            that.close();
          }, delay);
        }
      }).dimmer('show');
      if (this.message.autoHide) {
        timeoutHandle = setTimeout(function() {
          dimmer.dimmer('hide');
        }, this.message.autoHide);
      }
    },
    onClose: function() {
      var dimmer = this.$el.parent();
      dimmer.dimmer('destroy');
    },
    serializeData: function() {
      return this.message;
    }
  });
});
