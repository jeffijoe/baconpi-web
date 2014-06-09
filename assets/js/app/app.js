/**
 * App module
 */
define([
  'jquery', 'lodash',
  'backbone',
  'marionette',
  'config',
  'semantic',
  'misc/marionette-patches'
], function($, _, Backbone, Marionette) {
  'use strict';

  var App = new Marionette.Application();
  App.Behaviors = {};
  App.entities = {};
  App.addRegions({
    menu: '#menu',
    content: '#content',
    notifications: '#notifications'
  });

  Marionette.Behaviors.behaviorsLookup = function() {
    return App.Behaviors;
  };

  function onModulesLoaded() {
    if (Backbone.history) {
      Backbone.history.start({
        pushState: true
      });

      if (App.getCurrentRoute() === '') {
        App.trigger('list:agents');
      }
    }
    $('#bootstrapping-dimmer').remove();

  }

  App.navigate = function(fragment, options) {
    Backbone.history.navigate(fragment, options);
  };

  App.getCurrentRoute = function() {
    return Backbone.history.fragment;
  };

  App.startModule = function(moduleName, args) {
    var currentModule = moduleName ? App.module(moduleName) : null;
    if (App.currentModule === currentModule) {
      return;
    }

    if (App.currentModule) {
      App.currentModule.stop();
    }

    App.currentModule = currentModule;
    if (currentModule) {
      currentModule.start(args);
    }
  };

  App.addInitializer(function() {
    require([
      'modules/common/behaviors/device_edit_behavior',
      'modules/common/behaviors/dropdown_behavior',
      'modules/common/behaviors/semui_validation_behavior',
      'modules/common/behaviors/onreturn_behavior',
      'modules/navbar/navbar_module',
      'modules/common/notification/notification_module',
      'modules/agent/agent_module',
      'modules/computer/computer_module',
      'modules/user/user_module'
    ], onModulesLoaded);
  });
  return App;
});
