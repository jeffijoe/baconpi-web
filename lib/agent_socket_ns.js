/**
 * @module Agent Socket Namespace setup.
 * @param {Socket Manager} io Socket.IO
 * @author Jeff Hansen
 */
/*global Computer, Agent*/
'use strict';
var Q = require('q'),
  _ = require('lodash');

module.exports = function(io) {
  function getAgentSocket(agentMac) {
    return _.find(agentNamespace.clients(), function(socket) {
      var data = socket.handshake.query;
      return (data.clientType === 'agent' && data.mac === agentMac);
    });
  }

  var agentNamespace = io.of('/agentsocket');
  agentNamespace.authorization(function(handshakeData, accept) {
    accept(null, true);
  });
  agentNamespace.on('connection', function(socket) {
    var socketData = socket.handshake.query;
    socket.on('disconnect', function() {

    });

    if (socketData.clientType === 'client') {
      socket.on('wake', function(data) {
        var computerPromise = Q(Computer.findOne(data.computerId));
        var agentPromise = Q(Agent.findOne(data.agentId));
        Q.spread([computerPromise, agentPromise], function(computer, agent) {
          var agentSocket = getAgentSocket(agent.macAddress);
          agentSocket.emit('wake', {
            mac: computer.macAddress
          });
        });
      });
    } else if(socketData.clientType === 'agent') {
      socket.on('wakeSignalSent', function (data) {
        console.log('Signal sent!');
        if(data.error) {
          console.log('Error:', data.error);
        }
      });
    }
  });
  io.agentNamespace = agentNamespace;
};
