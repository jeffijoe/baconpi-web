/**
 * User Module
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/user/user_controller'
], function($, _, Backbone, Marionette, App, UserController) {
  App.module('UserModule', function(UserModule) {
    UserModule.startWithParent = false;
    UserModule.onStart = function () {
      console.log('User Module started.');
    };
    
    UserModule.onStop = function () {
      console.log('User Module stopped.');
    };
    
    var userController = new UserController();
    var UserRoutes = Marionette.AppRouter.extend({
      onRoute: function () {
        startModule();
      },
      appRoutes: {
        'me(/)': 'editUser'
      }
    });
    
    var startModule = function() {
      App.startModule('UserModule');
    };
    
    var UserRouteController = Marionette.Controller.extend({
      editUser: function () {
        userController.editUser({user: App.entities.currentUser});
      }
    });
    
    var API = new UserRouteController();
    App.addInitializer(function () {
      new UserRoutes({
        controller: API
      });
    });
    
    App.vent.on('edit:user', function () {
      startModule();
      API.editUser();
      App.navigate('/me');
    });
  });
});
