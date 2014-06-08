/**
 * Agents collection
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'models/agent_model',
  'collections/base_collection'
], function($, _, Backbone, Marionette, App, Agent, BaseCollection) {
  var Agents = BaseCollection.extend({
    url: '/api/agent',
    model: Agent,
    comparator: 'deviceName'
  });
  App.entities.agents = new Agents();
  return Agents;
});
