/**
 * Bootstrapper
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'collections/agents_collection',
  'models/user_model'
], function($, _, Backbone, Marionette, App) {
  App.entities.currentUser.fetch().fail(function(xhr) {
    if (xhr.status == 401) {
      location.href = '/account';
    }
  });
  App.entities.agents.fetch({
    reset: true
  });
});
