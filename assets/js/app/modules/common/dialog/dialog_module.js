/**
 * Dialog Module
 * Author: Jeff Hansen
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/common/dialog/views/dialog_view',
  'modules/common/dialog/views/confirm_view'
], function($, _, Backbone, Marionette, DialogView, ConfirmDialogView) {
  var DialogController = Marionette.Controller.extend({
    /**
     * Creates the view, shows it and returns the promise.
     * @param  {Object} opts Options.
     * @return {jQuery Promise}
     */
    show: function(opts) {
      var deferred = $.Deferred();
      opts._deferred = deferred;
      var ViewToUse = opts.view || DialogView;
      var view = new ViewToUse(opts);
      view.render();
      return deferred.promise();
    },
    /**
     * Creates a Confirm Dialog view.
     * @param  {Object} opts Options.
     * @return {jQuery Promise}
     */
    confirm: function (opts) {
      var promise = this.show(_.defaults(opts, {
        view: ConfirmDialogView
      }));
      return this._augmentConfirmPromise(promise);
    },
    /**
     * Augments/decorates our promise object with ok and cancel methods, that are proxies to done and fail.
     * @param  {[type]} promise [description]
     * @return {[type]}         [description]
     */
    _augmentConfirmPromise: function (promise) {
      promise.ok = promise.done;
      promise.cancel = promise.fail;
      return promise;
    }
  });
  
  // Exposing the module, adding 
  // the constructor for the controller 
  // in case someone wants to use it.
  return {
    /**
     * Controller constructor.
     * @type {DialogController}
     */
    DialogController: DialogController,
    /**
     * Shows a dialog.
     * @param  {Object} opts Options
     * @return {jQuery Promise}      Promise.
     */
    show: function (opts) {
      var dialog = new DialogController();
      return dialog.show(opts);
    },
    /**
     * Shows a Confirm dialog.
     * @param  {Object} opts Options
     * @return {jQuery Promise}      Promise.
     */
    confirm: function (opts) {
      var dialog = new DialogController();
      return dialog.confirm(opts);
    }
  };
});
