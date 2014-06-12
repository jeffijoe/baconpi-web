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
    var socket;
    Waker.startsWithParent = true;
    Waker.onStart = function() {
      // Localhost socket URL.
      var socketUrl = 'http://localhost:1337/agentsocket';
      
      // Makes sure we connect correctly regardless of SSL or not.
      // NOTE: This is specific to OpenShift.
      if (window.document.location.port === '') {
        socketUrl = window.document.location.protocol + '//' + window.document.location.hostname;
        if(window.document.location.protocol === 'http:')
          socketUrl  += ':8000';
        if(window.document.location.protocol === 'https:')
          socketUrl  += ':8443';
        socketUrl += '/agentsocket';
      }
      
      if(socket)
        socket.disconnect();
      
      socket = io.connect(socketUrl, {
        query: $.param({
          clientType: 'client',
          userId: App.entities.currentUser.id
        })
      });
      socket.on('connect', function() {
        App.vent.trigger('waker:connect');
      });
      socket.on('disconnect', function() {
        App.vent.trigger('waker:disconnect');
      });
      socket.on('error', function(error) {
        App.vent.trigger('waker:error', error);
      });
      socket.on('current:agents', function(data) {
        var connectedAgents = App.entities.agents.filter(function(agent) {
          return _.contains(data.connectedAgents, agent.get('macAddress'));
        });
        _.each(connectedAgents, function(agent) {
          agent.set({
            connected: true
          });
        });
        App.vent.trigger('waker:current:agents', connectedAgents);
      });
      socket.on('agent:connect', function(data) {
        var agentId = data.agentId;
        var agent = App.entities.agents.findWhere({
          id: agentId
        });
        agent.set({
          connected: true
        });
        App.vent.trigger('waker:agent:connect', agent);
      });
      socket.on('agent:disconnect', function(data) {
        var agentId = data.agentId;
        var agent = App.entities.agents.findWhere({
          id: agentId
        });
        agent.set({
          connected: false
        });
        App.vent.trigger('waker:agent:connect', agent);
      });
      socket.on('signal:send', function(data) {
        App.vent.trigger('waker:signal:send', data);
        App.execute('showSuccessMessage', {
          title: 'Signal sent!',
          message: 'If everything went smooth as fuck, your computer should be booting right now.'
        });
      });
      socket.on('signal:error', function(data) {
        App.vent.trigger('waker:signal:error', data);
        var message = data.error ? data.error : 'An unknown error occured while sending the wakeup signal.';
        App.execute('showErrorMessage', {
          title: 'Oh noes!',
          message: message
        });
      });
    };

    Waker.onStop = function() {
      if(socket)
        socket.disconnect();
    };

    Waker.wakeComputer = function(computer) {
      App.vent.trigger('waker:before:signal:send');
      computer.trigger('before:signal:send', computer);
      var agentId = computer.get('agentId');
      socket.emit('wake', {
        agentId: agentId,
        computerId: computer.id
      });
    };

    // Weeee..
    App.commands.setHandler('wakeComputer', function(computer) {
      Waker.wakeComputer(computer);
    });
  });
});
