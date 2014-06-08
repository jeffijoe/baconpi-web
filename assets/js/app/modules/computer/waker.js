/**
 * Waker - responsible for waking up a computer.
 */
'use strict';
define([
  'jquery',
  'lodash',
  'backbone',
  'marionette',
  'app',
  'socket-io'
], function($, _, Backbone, Marionette, App, io) {
  App.module('WakerModule', function(Waker) {
    Waker.startsWithParent = true;
    Waker.onStart = function () {
      console.log('Waker module started.');
    };
    
    Waker.onStop = function () {
      console.log('Waker module stop.');
    };
    
    Waker.wakeComputer = function (computer) {
      App.vent.trigger('waker:before:signal:send');
      computer.trigger('before:signal:send');
      var agentId = computer.get('agentId');
      socket.emit('wake', {
        agentId: agentId,
        computerId: computer.id
      });
    };
    
    var socketUrl = 'http://localhost:1337/agentsocket';
    if(window.document.location.port === '') {
      socketUrl = window.document.location.protocol+'//'+window.document.location.hostname+':8443/agentsocket';
    }
    console.log('Socket URL: ', socketUrl);
    var socket = io.connect(socketUrl, {
      query: 'clientType=client'
    });
    socket.on('connect', function () {
      App.vent.trigger('waker:connect');
    });
    socket.on('disconnect', function () {
      App.vent.trigger('waker:disconnect');
    });
    socket.on('signal:sent', function () {
      App.vent.trigger('waker:signal:send');
    });
    
    // Weeee..
    App.commands.setHandler('wakeComputer', function(computer) {
      Waker.wakeComputer(computer);
    });
  });
});
