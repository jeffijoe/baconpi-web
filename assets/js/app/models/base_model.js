/**
 * Base Model
 */
'use strict';
define(['jquery', 'lodash', 'backbone', 'marionette'], function($, _, Backbone, Marionette) {
  return Backbone.Model.extend({
    revert: function () {
      this.set(this.previousAttributes());
    }
  });
});
