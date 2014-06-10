/**
 * Computers Module
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/computer/list/computer_list_controller',
  'modules/computer/edit/computer_edit_controller',
  'modules/computer/waker'
], function($, _, Backbone, Marionette, App, ComputerListController, ComputerEditController) {
  return App.module('ComputersModule', function(ComputersModule, App) {
    ComputersModule.startWithParent = false;
    ComputersModule.onStart = function() {
      console.log('Computers Module started');
    };
    ComputersModule.onStop = function() {
      // We don't call stopListening since 
      // we want our success/fail events to run.
      console.log('Computers Module stopped');
    };

    var startModule = function() {
      App.startModule('ComputersModule');
    };

    var editController = new ComputerEditController();
    
    // Computer router.
    var ComputerRouter = Marionette.AppRouter.extend({
      onRoute: function () {
        startModule();
      },
      appRoutes: {
        'computers/new(/)': 'addComputer',
        'computers/:id/edit(/)': 'editComputer'
      }
    });
    
    // I COULD move this into a separate file. But I can't be bothered.
    var ComputerRouterController = Marionette.Controller.extend({
      addComputer: function (currentAgent) {
        this._setupEditControllerEvents({
          save: this._defaultEditCallback,
          cancel: function () {
            if(!currentAgent)
              App.vent.trigger('list:agents');
            else 
              App.vent.trigger('show:agent', currentAgent);
          }
        });
        editController.addComputer(currentAgent);
      },
      editComputer: function(id, opts) {
        this._setupEditControllerEvents(opts);
        editController.editComputerById(id);
      },
      _setupEditControllerEvents: function (opts) {
        opts = opts || {
          save: this._defaultEditCallback,
          cancel: this._defaultEditCallback,
        };
        this.stopListening(editController);
        this.listenTo(editController, 'edit:computer:save', opts.save);
        this.listenTo(editController, 'edit:computer:cancel', opts.cancel);
        this.listenTo(editController, 'edit:computer:save:success', this._saveSuccess);
        this.listenTo(editController, 'edit:computer:save:fail', this._saveFail);
      },
      _saveSuccess: function (computer) {
        App.vent.trigger('show:agent', computer.get('agentId'));
        App.execute('showSuccessMessage', {
          title: 'Awesome',
          message: 'Computer has been saved. That\'s just diddeley duddely dang awesome.'
        });
      },
      _saveFail: function () {
        App.execute('showErrorMessage', {
          title: 'Crap, again?',
          message: 'Something went wrong while saving.. Yeah, dammit.'
        });
      },
      _defaultEditCallback: function (computer) {
        App.vent.trigger('show:agent', computer.get('agentId'));
      }
    });

    var API = new ComputerRouterController();
    App.addInitializer(function() {
      new ComputerRouter({
        controller: API
      });
    });
    
    App.vent.on('add:computer', function (owningAgent) {
      startModule();
      API.addComputer(owningAgent);
      App.navigate('/computers/new');
    });
    
    App.vent.on('edit:computer', function(computer, opts) {
      startModule();
      API.editComputer(computer.id, opts);
      App.navigate('/computers/' + computer.id + '/edit');
    });

    // Setup the handler for our List controller.
    // At the moment we are only using the list controller one place.
    App.reqres.setHandler('computerListController', function(opts) {
      var controller = new ComputerListController(opts);
      return controller;
    });
  });
});
