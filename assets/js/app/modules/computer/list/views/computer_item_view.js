/**
 * Computer Item View
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'modules/computer/list/templates/computer_item_template'
], function ($, _, Backbone, Marionette, template) {
   return Marionette.ItemView.extend({
     template: template,
     el:'<div class="computer ui segment">',
     ui: {
       edit: '.edit.button',
       destroy: '.delete.button',
       wake: '.awake.button'
     },
     triggers: {
       'click @ui.wake': 'wake:computer',
       'click @ui.edit': 'edit:computer',
       'click @ui.destroy': 'delete:computer'
     }
   });
});