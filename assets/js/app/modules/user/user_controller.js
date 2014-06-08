/**
 * User Controller
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/user/views/user_view'
], function($, _, Backbone, Marionette, App, UserView) {
  return Marionette.Controller.extend({
    initialize: function () {
      _.bindAll(this, 'editUser');
    },
    editUser: function(opts) {
      var view = new UserView({
        model: opts.user
      });
      this.listenTo(view, 'save:user', this.saveUser);
      this.listenTo(view, 'save:password', this.changePassword);
      App.content.show(view);
      this.listenTo(view, 'close', function () {
        this.stopListening(view);
      });
    },
    saveUser: function (user) {
      user.save().then(function () {
        App.execute('showSuccessMessage', {
          title: 'Wooo, yeah!',
          message: 'Your details have been saved. Nice.',
          autoHide: 2500
        });
        App.vent.trigger('list:agents');
      }).fail(function () {
        App.execute('showErrorMessage', {
          title: 'Noooes.. :(',
          message: 'I really thought this thing was flawless. Oh well, I\'m sorry..',
        });
        user.revert();
      });
    },
    changePassword: function (args) {
      var user = args.user;
      user.changePassword(args.oldPassword, args.newPassword).then(function () {
        App.execute('showSuccessMessage', {
          title: 'Awwww yiss',
          message: 'Password changed.',
          autoHide: 2500
        });
        App.vent.trigger('list:agents');
      }).fail(function (xhr) {
        var message = 'So changing that password did not go as planned. Try again.';
        var code = xhr.status;
        var response = JSON.parse(xhr.responseText);
        if(code == 400) {
          if(response.error)
            message = response.error;
        }
        App.execute('showErrorMessage', {
          title: 'Didn\' work.',
          message: message,
        });
      });
    }
  });
});
