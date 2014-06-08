/**
 * Navbar View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/navbar/views/navbar_agents_view',
  'modules/navbar/views/navbar_account_view',
  'modules/navbar/templates/navbar_template'
], function($, _, Backbone, Marionette, NavbarAgentsView, NavbarUserView, template) {
  return Marionette.Layout.extend({
    template: template,
    ui: {
      // We want to insert our sub-views next to this
      navBrand: '#nav-brand',
      agentSelector: '#agents-navbar-selector',
      userMenu: '#user-menu'
    },
    // regions: {
    //   agentSelector: '#agents-navbar-selector'
    // },
    behaviors: {
      Dropdown: {}
    },
    onRender: function() {
      this._renderAgents();
      this._renderUserMenu();
    },
    _renderUserMenu: function () {
      var userMenuView = this.userMenuView = new NavbarUserView({
        el: this.ui.userMenu
      });
      this.listenTo(userMenuView, 'edit:user', function () {
        this.trigger('edit:user');
      });
      // Ensures our dropdown gets reinit'ed.
      this.listenTo(userMenuView, 'render', function () {
        this.triggerMethod('dom:refresh');
      });
      userMenuView.render();
    },
    _renderAgents: function () {
      // The original idea was to actually
      // use a region, but that would add a container.
      var agentsView = this.agentsView = new NavbarAgentsView({
        collection: this.collection,
        el: this.ui.agentSelector
      });
      this.listenTo(agentsView, 'add:agent', function () {
        this.trigger('add:agent');
      });
      this.listenTo(agentsView, 'select:agent', function (agent) {
        this.trigger('select:agent', agent);
      });
      this.listenTo(agentsView, 'list:agents', function () {
        this.trigger('list:agents');
      });
      // This is the dropdown item's root, The DOM structure is very important!!
      this.agentsView.render();
    },
    onBeforeClose: function() {
      // Manual cleanup. Is it possible to avoid this?
      if (this.agentsView) {
        this.stopListening(this.agentsView);
        this.agentsView.close();
      }
      if (this.userMenuView) {
        this.stopListening(this.userMenuView);
        this.userMenuView.close();
      }
      this.userMenuView = null;
    },
  });
});
