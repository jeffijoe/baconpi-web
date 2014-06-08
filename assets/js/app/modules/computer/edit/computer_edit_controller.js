/**
 * Computer Edit Controller
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/computer/edit/views/computer_edit_view',
  'models/computer_model'
], function($, _, Backbone, Marionette, App, ComputerEditView, Computer) {
  return Marionette.Controller.extend({
    initialize: function() {
      _.bindAll(this, 'editComputerById', 'editComputer');
    },
    editComputerById: function(id) {
      App.entities.allComputers.getById(id).then(this.editComputer);
    },
    addComputer: function(owningAgent) {
      var agentId = null;
      if(owningAgent)
        agentId = owningAgent.id;
      var view = this._createEditView({
        model: new Computer({
          agentId: agentId
        })
      });
      App.content.show(view);
    },
    editComputer: function(computer) {
      var view = this._createEditView({
        model: computer
      });
      App.content.show(view);
    },
    _createEditView: function(opts) {
      opts = opts || {};
      var view = new ComputerEditView(opts);
      this.listenTo(view, 'edit:computer:cancel', function() {
        this.trigger('edit:computer:cancel', opts.model || null);
      });
      this.listenTo(view, 'edit:computer:save', this._saveComputer);
      this.listenTo(view, 'close', function() {
        this.stopListening(view);
      });
      return view;
    },
    _saveComputer: function(computer) {
      this.trigger('edit:computer:save', computer);
      var success = _.bind(function() {
        this.trigger('edit:computer:save:success', computer);
      }, this);
      var fail = _.bind(function(xhr) {
        this.trigger('edit:computer:save:fail', xhr);
      }, this);
      computer.save().then(success, fail);
    }
  });
});
