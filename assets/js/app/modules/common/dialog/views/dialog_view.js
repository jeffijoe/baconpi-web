/**
 * Dialog View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette'
], function($, _, Backbone, Marionette) {
  return Marionette.ItemView.extend({
    /**
     * The Semantic UI modal root element. This is appended to the body.
     * @type {String}
     */
    el: '<div class="ui modal">',
    /**
     * Initializer. Standard Backbone stuff.
     */
    initialize: function(opts) {
      this.options = opts;
      this.options.modalOptions = this.options.modalOptions || {};
      // Tell SemanticUI that WE'RE THE GOD DAMN BAWS UP IN HERE!
      // ... "Semantic, please, I will let you know when I want to close the dialog. Kthxbai :)"
      this.options.modalOptions.selector = {
        close: '',
        approve: '',
        deny: ''
      };

      // Ensure's the onRender will not be overriden.
      this.listenTo(this, 'render', this._onRender);
      this._setupOptions();
    },
    /**
     * Hides the dialog, resolving the promise with the passed result.
     * @param  {[type]} success If true, resolves the promise. If false, rejects it.
     * @param  {[type]} result  Data to pass to promise resolution.
     */
    hideDialog: function(success, result) {
      var promiseOpts = {
        success: success,
        data: result
      };
      
      if(!_.isBoolean(success)){
        promiseOpts = {
          success: true,
          data: success
        };
      }

      this.trigger('hide:dialog', promiseOpts);
      this.$el.modal('hide');
      this._resolvePromise(promiseOpts);
    },
    /**
     * Sets up modal options and what not.
     */
    _setupOptions: function() {
      // Shortcut our modal options.
      var modalOpts = this.options.modalOptions;
      // Ensure that the user can provide these callbacks,
      // but that they won't overwrite ours.
      modalOpts._onHidden = modalOpts.onHidden || $.noop;

      // Modal options are passed to SemanticUI's modal module.
      _.extend(modalOpts, {
        onHidden: _.bind(this._closeAndDestroy, this)
      });
    },
    /**
     * 'render' event callback.
     * I specifically did not provide a render method myself
     * to avoid having to call any overrides.
     */
    _onRender: function() {
      var $modal = this.$el;
      $modal
        .modal(this.options.modalOptions)
        .modal('show');
    },
    /**
     * Resolves the promise. Best description ever.
     * @param result result to resolve the promise with.
     */
    _resolvePromise: function(result) {
      var method = result.success ? this.options._deferred.resolve : this.options._deferred.reject;
      method(result.data);
    },
    /**
     * Closes the view and destroys the modal, cleaning
     * up our shit.
     */
    _closeAndDestroy: function() {
      this.$el.modal('destroy');
      this.close();
    }
  });
});
