/**
 * Marionette patches
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette'
], function($, _, Backbone, Marionette) {
  var appendHtml = function(parentView, itemView, index) {
    var $container = this.getItemViewContainer ? this.getItemViewContainer(parentView) : parentView.$el,
      children = $container.children();

    if (parentView.isBuffering) {
      parentView.elBuffer.appendChild(itemView.el);
      parentView._bufferedChildren.push(itemView);
    } else {
      if (children.size() <= index) {
        $container.append(itemView.el);
      } else {
        children.eq(index).before(itemView.el);
      }
    }
  };

  Marionette.CollectionView = Marionette.CollectionView.extend({
    appendHtml: appendHtml
  });

  Marionette.CompositeView = Marionette.CompositeView.extend({
    appendHtml: appendHtml
  });
});
