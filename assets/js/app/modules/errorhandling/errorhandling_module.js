/**
 * Error handling module.
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/errorhandling/errorhandling_controller'
], function ($, _, Backbone, Marionette, App, ErrorController) {
   App.module('ErrorHandling', function (ErrorHandlingModule) {
     ErrorHandlingModule.startsWithParent = true;
     ErrorHandlingModule.onStart = function () {
       console.log('Error Handling Module started.');
     };
     ErrorHandlingModule.onStop = function () {
       console.log('Error Handling Module stopped.');
     };
     
     var controller = new ErrorController();
     
     App.commands.setHandler('showError', function (model, xhr, options) {
       controller.showModelError(model, xhr, options);
     });
     
     App.commands.setHandler('showModelError', function (model, xhr, options) {
       controller.showModelError(model, xhr, options);
     });
   });
});