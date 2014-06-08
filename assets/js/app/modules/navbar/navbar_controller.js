/**
 * Navbar Controller
 */
'use strict';
define([
    'jquery',
    'lodash',
    'backbone',
    'marionette',
    'app',
    'modules/navbar/views/navbar_view'
  ],
  function($, _, Backbone, Marionette, App, NavbarView) {
    return Marionette.Controller.extend({
      initialize: function() {
        var agents = App.entities.agents;
        this.agents = agents;
      },
      showNavbar: function() {
        var view = new NavbarView({
          collection: App.entities.agents
        });
        this.listenTo(view, 'select:agent', this._agentSelected);
        this.listenTo(view, 'add:agent', this._addAgent);
        this.listenTo(view, 'list:agents', this._listAgents);
        this.listenTo(view, 'edit:user', this._editUser);
        App.menu.show(view);
      },
      _editUser: function () {
        App.vent.trigger('edit:user');
      },
      _agentSelected: function(agent) {
        this.trigger('select:agent', agent);
      },
      _addAgent: function () {
        this.trigger('add:agent');
      },
      _listAgents: function () {
        App.vent.trigger('list:agents');
      }
    });
  });
