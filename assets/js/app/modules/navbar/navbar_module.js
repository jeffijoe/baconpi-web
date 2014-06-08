/**
 * Navbar Module
 */
'use strict';
define(['jquery', 'lodash', 'backbone', 'marionette', 'app', 'modules/navbar/navbar_controller'], function($, _, Backbone, Marionette, App, NavbarController) {
  return App.module('Navbar', function() {
    var controller = new NavbarController();
    controller.on('add:agent', function () {
      App.vent.trigger('add:agent');
    });
    
    controller.on('select:agent', function (agent) {
      App.vent.trigger('show:agent', agent);
    });
    
    App.addInitializer(function() {
      controller.showNavbar();
    });
  });
});
