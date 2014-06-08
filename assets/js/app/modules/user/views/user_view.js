/**
 * User View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/user/views/user_password_view',
  'modules/user/templates/user_view_template'
], function($, _, Backbone, Marionette, App, PasswordView, template) {
  return Marionette.Layout.extend({
    template: template,
    ui: {
      txtName: '#name',
      txtEmail: '#email',
      btnSubmit: '.ui.button.submit.user'
    },
    behaviors: {
      SemanticValidation: {
        form: '.ui.user.form',
        validation: {
          name: {
            identifier: 'name',
            rules: [{
              type: 'empty',
              prompt: 'Please enter your name'
            }]
          },
          email: {
            identifier: 'email',
            rules: [{
              type: 'empty',
              prompt: 'Please enter your email.'
            }, {
              type: 'email',
              prompt: 'Yeah, how about we try that again..'
            }]
          },
        }
      },
      OnReturn: {
        selector: '.user.form input[type="text"]',
        method: function () {
          this.saveChanges();
        }
      }
    },
    events: {
      'click @ui.btnSubmit': 'saveChanges'
    },
    regions: {
      passwordView: '#password-container'
    },
    onRender: function () {
      var passwordView = new PasswordView({
        model: this.model
      });
      this.listenTo(passwordView, 'save:password', function (args) {
        this.trigger('save:password', args);
      });
      this.listenTo(passwordView, 'close', function () {
        this.stopListening(passwordView);
      });
      this.passwordView.show(passwordView);
    },
    saveChanges: function() {
      var valid = this.validate();
      if(!valid) 
        return;
      this.model.set({
        name: this.ui.txtName.val(),
        email: this.ui.txtEmail.val(),
      });
      this.trigger('save:user', this.model);
    }
  });
});
