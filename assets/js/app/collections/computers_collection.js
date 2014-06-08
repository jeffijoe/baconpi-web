/**
 * Computers Collection
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'collections/base_collection',
  'models/computer_model'
], function($, _, Backbone, Marionette, App, BaseCollection, Computer) {
  var Computers = BaseCollection.extend({
    url: '/api/computer',
    model: Computer,
    comparator: 'name',
    initialize: function (models, options) {
      options = options || {};
      var agentScope = options.scope;
      if(!agentScope) return;
      this.url = '/api/agent/'+agentScope.id+'/computers';
    }
  });

  App.entities.allComputers = new Computers();
  return Computers;
});
