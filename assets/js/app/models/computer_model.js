/**
 * Computer Model
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette'
], function ($, _, Backbone, Marionette) {
   return Backbone.Model.extend({
     urlRoot: '/api/computer'
   });
});