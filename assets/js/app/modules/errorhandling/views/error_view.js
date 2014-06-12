/**
 * Error View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/errorhandling/templates/error_template'
], function ($, _, Backbone, Marionette, App, template) {
   return Marionette.ItemView.extend({
    template: template,
    ui: {
      btnBack: '#go-back'
    },
    events: {
      'click @ui.btnBack': 'goBack'
    },
    goBack: function (e) {
      App.vent.trigger('list:agents');
    },
    initialize: function (opts) {
      this.error = opts.error;
    },
    serializeData: function () {
      var 
          error = this.error,
          title = 'An error has occured.',
          message = 'Sorry..';
      
      if(_.isString(error)){
        message = error;
      } else {
        title = error.title || title;
        message = error.message || message;
      }
      return {
        title: title,
        message: message
      };
    }
   });
});