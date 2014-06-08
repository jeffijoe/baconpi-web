/**
 * User Model
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'models/base_model'
], function($, _, Backbone, Marionette, App, BaseModel) {
  var User = BaseModel.extend({
    urlRoot: '/api/session/current',
    save: function(attributes, options) {
      // Saving a user is not done through the standard API.
      options = _.defaults(options || {}, {
        method: 'PUT',
        url: '/account/change'
      });
      return BaseModel.prototype.save.call(this, attributes, options);
    },
    changePassword: function (oldPassword, newPassword) {
      return $.ajax({
        method:'PUT',
        url: '/account/changepassword',
        data: {
          oldPassword: oldPassword,
          newPassword: newPassword
        }
      });
    }
  });
  // There's only ever going to be one user.
  App.entities.currentUser = new User();
  return User;
});