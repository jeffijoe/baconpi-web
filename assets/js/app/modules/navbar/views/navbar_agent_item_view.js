/**
 * Navbar Agent Item View
 */
'use strict';
define(['jquery', 'lodash', 'backbone', 'marionette', 'modules/navbar/templates/navbar_agent_item_template'], function($, _, Backbone, Marionette, template) {
  return Marionette.ItemView.extend({
    template: template,
    el: '<a class="item">',
    events: {
      'click': 'select'
    },
    modelEvents: {
      change: 'render'
    },
    select: function() {
      this.trigger('select:agent', this.model);
    }
  });
});
