/**
 * Notification Module
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/common/notification/notification_controller'
], function($, _, Backbone, Marionette, App, NotificationsController) {
  return App.module('Common.Notifications', function() {
    var controller = new NotificationsController({
      region: App.notifications
    });

    App.commands.setHandlers({
      showSuccessMessage: function(message) {
        controller.showSuccessMessage(message);
      },
      showErrorMessage: function(message) {
        controller.showErrorMessage(message);
      },
      showInfoMessage: function(message) {
        controller.showInfoMessage(message);
      },
    });
  });
});
