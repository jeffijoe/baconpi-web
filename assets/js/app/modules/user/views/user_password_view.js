/**
 * User Password View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/user/templates/user_password_template'
], function($, _, Backbone, Marionette, template) {
  return Marionette.ItemView.extend({
    template: template,
    ui: {
      btnShow: '#show-password-form',
      info: '.password-info',
      formContainer: '.password-form',
      btnSavePassword: '.ui.submit.password',
      txtOldPassword: '#old-password',
      txtNewPassword: '#new-password'
    },
    behaviors: {
      SemanticValidation: {
        form: '.ui.form',
        validation: {
          oldPassword: {
            identifier: 'old-password',
            rules: [{
              type: 'empty',
              prompt: 'Please enter your old password'
            }]
          },
          password: {
            identifier: 'new-password',
            rules: [{
              type: 'empty',
              prompt: 'Please enter a password'
            }, {
              type: 'length[6]',
              prompt: 'Your password must be at least 6 characters'
            }]
          },
          passwordAgain: {
            identifier: 'new-password-again',
            rules: [{
              type: 'empty',
              prompt: 'Please enter your password again'
            }, {
              type: 'length[6]',
              prompt: 'Your password must be at least 6 characters'
            }, {
              type: 'match[new-password]',
              prompt: 'Passwords should probably match, yeah..'
            }]
          }
        }
      }
    },
    events: {
      'click @ui.btnShow': 'formContainer',
      'click @ui.btnSavePassword': 'savePassword'
    },
    formContainer: function() {
      this.ui.info.hide();
      this.ui.formContainer.show();
    },
    savePassword: function () {
      if(!this.validate())
        return;
      this.trigger('save:password', {
        user: this.model, 
        oldPassword: this.ui.txtOldPassword.val(), 
        newPassword: this.ui.txtNewPassword.val()
      });
    }
  });
});
