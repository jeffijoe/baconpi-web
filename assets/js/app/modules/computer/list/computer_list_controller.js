/**
 * Computer List Controller
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'modules/computer/list/views/computer_item_view',
  'modules/common/dialog/dialog_module'
], function($, _, Backbone, Marionette, App, ComputerItemView, Dialog) {
  /**
   * The fun part is this: We are using this controller multiple times.
   */
  return Marionette.Controller.extend({
    initialize: function(opts) {
      this.collection = opts.collection;
      _.bindAll(this, 'listComputers', '_showList', 'editComputer', 'destroyComputer', 'wakeComputer');
    },
    listComputers: function() {
      this.collection.fetch().then(this._showList);
    },
    editComputer: function(itemview) {
      App.vent.trigger('edit:computer', itemview.model);
    },
    destroyComputer: function(itemview) {
      var computer = itemview.model;
      Dialog.confirm({
        title: 'Delete ' + computer.get('name') + '?',
        content: 'Are you really sure you want to delete this computer?',
        ok: 'Delete',
        cancel: ' Cancel',
        okClass: 'negative'
      }).ok(_.bind(function() {
        computer.destroy({restoreOnFail: true}).then(this._onDeleteSuccess, this._onDeleteFail);
      }, this));
    },
    wakeComputer: function (itemview) {
      App.execute('wakeComputer', itemview.model);
    },
    _onDeleteSuccess: function () {
      App.execute('showSuccessMessage', {
        title:'Success!',
        message: 'That computer is gone, yup. I mean, not physically, but.. from the system.. You get me?',
        autoHide: 2000
      });
    },
    _onDeleteFail: function () {
      App.execute('showErrorMessage', {
        title: 'Oh noez..',
        message: 'Something went wrong.. I don\'t like this.. Why does this happen?'
      });
    },
    _showList: function() {

    },
    getCollectionView: function() {
      var collectionView = new Marionette.CollectionView({
        tagName: 'div',
        collection: this.collection,
        itemView: ComputerItemView
      });
      this.listenTo(collectionView, 'itemview:delete:computer', this.destroyComputer);
      this.listenTo(collectionView, 'itemview:edit:computer', this.editComputer);
      this.listenTo(collectionView, 'itemview:wake:computer', this.wakeComputer);
      this.listenTo(collectionView, 'close', function() {
        this.stopListening(collectionView);
      });
      return collectionView;
    }
  });
});
