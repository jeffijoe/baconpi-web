/**
 * Error Handling Controller
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/errorhandling/views/error_view'
], function($, _, Backbone, Marionette, App, ErrorView) {
  return Marionette.Controller.extend({
    showError: function(error) {
      var view = new ErrorView({
        error: error
      });
      App.content.show(view);
    },
    showModelError: function(model, xhr) {
      var title = null;
      var message = null;

      if(xhr.status === 401) {
        window.document.location.href = '/account';
        return;
      }
      
      if(xhr.status === 403) {
        title = 'You can\'t just do that!';
        message = 'Whatever you were trying to do... You can\'t do that. Don\'t try it again. Thanks.';
      }
      
      if(xhr.status === 404) {
        title = 'That was\'t found.';
        message = 'Whatever it was you were looking for, it\' not here.. Sorry.';
      }

      this.showError({
        title: title,
        message: message
      });
    },
  });
});
