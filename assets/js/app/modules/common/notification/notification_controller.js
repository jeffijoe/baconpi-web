/**
 * Notification Controller
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/common/notification/notification_simpleview',
  'semantic'
], function($, _, Backbone, Marionette, SimpleView) {
  var NotificationController = Marionette.Controller.extend({
    initialize: function (options) {
      _.extend(this, options);
    },
    showMessage: function(options) {
      var view = new SimpleView(options);
      var region = this.region;
      // this.listenTo(view, 'close', function () {
      //   region.reset();
      // });
      this.region.show(view);
    },
    showInfoMessage: function (message) {
      return this.showMessage({
        message: message,
        type: 'info'
      });
    },
    showSuccessMessage: function (message) {
      return this.showMessage({
        message: message,
        type: 'success'
      });
    },
    showErrorMessage: function (message) {
      return this.showMessage({
        message: message,
        type: 'error'
      });
    }
  });

  return NotificationController;
});
