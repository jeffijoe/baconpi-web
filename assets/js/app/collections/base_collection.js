/**
 * Base Collection
 * Contains usefulness in the form of recoverable models in case of fuckup,
 * as well as a getById method that ensures only one instance 
 * of a model is in a particular collection.
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette'
], function($, _, Backbone) {
  return Backbone.Collection.extend({
    /**
     * .... Not gonna bother.
     */
    initialize: function () {
      this.on('destroy', this.onDestroy, this);
    },
    /**
     * When a model is destroyed, prepares for restoration in case of fuckup.
     */
    onDestroy: function (model, collection, options) {
      model.off('error', this.onDestroy, this);
      if(! options.restoreOnFail)
        return;
      model._indexBeforeDestroy = options.index;
      model.on('error', this.handleModelDestroyError, this);
    },
    /**
     * When a model is destroyed, but the sync failed, restore
     * our model.
     */
    handleModelDestroyError: function (model) {
      if(!this.contains(model)) {
        if(model._indexBeforeDestroy > 0) {
          this.add(model, {at: model._indexBeforeDestroy});  
        } else {
          this.add(model);
        }
        this.trigger('restored', model);
      }
    },
    /**
     * Safely gets and fetches an instance of a model.
     * If a model does not exist yet, it is added, without triggering an event.
     * This remedies race conditions between collection fetching and model fetching,
     * ensuring that anyone sharing the same collection gets the same model instances as well.
     */
    getById: function(id) {
      var model = this.get(id) || this.add({
        id: id
      }, {
        silent: true // Little model in my collection, dont fucking trigger anything.
      });
      return model.fetch().then(_.bind(function() {
        return model;
      }, this));
    }
  });
});
