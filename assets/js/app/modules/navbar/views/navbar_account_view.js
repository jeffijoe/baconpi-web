/**
 * Navbar Account View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/navbar/templates/navbar_account_template'
], function($, _, Backbone, Marionette, App, template) {
  return Marionette.ItemView.extend({
    template: template,
    initialize: function () {
      this.model = App.entities.currentUser;
    },
    ui: {
      btnEditUser: '#edit-user'
    },
    events: {
      'click @ui.btnEditUser': 'editUser'
    },
    modelEvents: {
      change: 'render'
    },
    editUser: function() {
      this.trigger('edit:user');
    }
  });
});
