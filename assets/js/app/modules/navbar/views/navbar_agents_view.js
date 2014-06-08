/**
 * Navbar Agents View
 */
'use strict';
define([
    'jquery',
    'lodash',
    'backbone',
    'marionette',
    'app',
    'modules/navbar/templates/navbar_agents_template',
    'modules/navbar/views/navbar_agent_item_view'
  ],
  function($, _, Backbone, Marionette, App, template, NavbarAgentItemView) {
    return Marionette.CompositeView.extend({
      template: template,
      itemView: NavbarAgentItemView,
      insertBefore: '#agents #list-agents',
      ui: {
        add: '#add-agent',
        listAgents: '#list-agents'
      },
      events: {
        'click @ui.add': 'addAgent',
        'click @ui.listAgents': 'listAgents'
      },
      behaviors: {
        Dropdown: {}
      },
      onBeforeItemAdded: function(itemView) {
        this.listenTo(itemView, 'select:agent', this._selectAgent);
        var that = this;
        this.listenTo(itemView, 'close', function () {
          that.stopListening(itemView);
        });
      },
      appendHtml: function(collectionView, itemView) {
        collectionView.$el.find(collectionView.insertBefore).before(itemView.el);
      },
      listAgents: function () {
        this.trigger('list:agents');
      },
      addAgent: function() {
        this.trigger('add:agent');
      },
      _selectAgent: function(agentModel) {
        this.trigger('select:agent', agentModel);
      }
    });
  });
