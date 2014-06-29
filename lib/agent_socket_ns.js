/**
 * @module Agent Socket Namespace setup.
 * @param {Socket Manager} io Socket.IO
 * @author Jeff Hansen
 */
/*global Computer, Agent*/
'use strict';
var Q = require('q'),
  _ = require('lodash');


module.exports = function(sails) {
  var io = sails.io,
    log = sails.log;
  // /**
  //  * Finds an agent socket based on it's MAC
  //  */

  // function getAgentSocketByMacAddress(agentMac) {
  //   return _.find(ns.clients(), function(socket) {
  //     var data = socket.handshake.query;
  //     return (data.clientType === 'agent' && data.mac === agentMac);
  //   });
  // }

  /**
   * Finds an agent socket based on it's user ID.
   */

  function getAgentSocketsByUserId(userId) {
    return _.filter(ns.clients(), function(socket) {
      var data = socket.handshake.query;
      return (data.clientType === 'agent' && data.userId === userId);
    });
  }


  // /**
  //  * Gets all client sockets with a particular user ID.
  //  */

  // function getClientSockets(userId) {
  //   return _.filter(ns.clients(), function(socket) {
  //     var data = socket.handshake.query;
  //     return (data.clientType === 'client' && data.userId === userId);
  //   });
  // }

  /**
   * Bubbles the event up to any associated client sockets.
   */

  function bubbleToClientSockets(socket, eventName) {
    socket.on(eventName, function(data) {
      // The userId is set by the notifyClientSockets... call
      var userId = socket.handshake.query.userId;
      log.info('Bubbling event "' + eventName + '" to client with user ID "' + userId + '"');

      ns.to(getClientRoom(userId)).emit(eventName, data);
    });
  }

  /**
   * Gets the client room name based on a user ID.
   */

  function getClientRoom(userId) {
    return 'client-' + userId;
  }

  /**
   * Gets the agent room name based on it's mac address.
   */

  function getAgentRoom(macAddr) {
    return 'agent-' + macAddr;
  }

  /**
   * Sets up the client socket events.
   */

  function setupClientSocket(socket) {
    var userId = socket.handshake.query.userId;
    socket.join(getClientRoom(userId));
    log.info('Setting up client socket. User ID: ' + userId);
    var connectedAgents = getAgentSocketsByUserId(userId).map(function(agentSocket) {
      return agentSocket.handshake.query.mac;
    });

    socket.emit('current:agents', {
      connectedAgents: connectedAgents
    });

    // Client requests a wakeup call for a specific computer via a specified agent.
    socket.on('wake', function(data) {
      var computerPromise = Q(Computer.findOne(data.computerId));
      var agentPromise = Q(Agent.findOne(data.agentId));
      Q.spread([computerPromise, agentPromise], function(computer, agent) {
        var macAddr = agent.macAddress;
        var room = getAgentRoom(macAddr);
        log.info('Emitted wake signal to '+room);
        ns.to(room).emit('wake', {
          mac: computer.macAddress,
          userId: computer.userId
        });
      });
    });


  }

  /**
   * Sets up the agent socket events.
   */

  function setupAgentSocket(socket) {
    // Alarm any client sockets of this agent's connection.
    var macAddr = socket.handshake.query.mac;
    socket.join(getAgentRoom(macAddr));
    log.info('Setting up agent socket. Agent MAC: ' + macAddr);
    notifyClientSocketsOfAgentConnection(socket).then(function() {
      bubbleToClientSockets(socket, 'signal:send');
      bubbleToClientSockets(socket, 'signal:error');
      socket.on('disconnect', function() {
        var userId = socket.handshake.query.userId;
        ns.to(getClientRoom(userId)).emit('agent:disconnect', {
          agentId: socket.handshake.query.agentId
        });
      });
    });
  }

  /**
   * Notifies all connected clients that owns this agent of it's connection.
   * It also associates a user ID with the socket.
   */

  function notifyClientSocketsOfAgentConnection(agentSocket) {
    var agentMac = agentSocket.handshake.query.mac;
    return Q(Agent.findOneByMacAddress(agentMac)).then(function(agent) {
      if (!agent) throw new Error('Agent with MAC "' + agentMac + '" not found.');

      agentSocket.handshake.query.userId = agent.userId;
      agentSocket.handshake.query.agentId = agent.id;

      ns.to(getClientRoom(agent.userId)).emit('agent:connect', {
        agentId: agent.id
      });
    }).fail(function(err) {
      log.error(err);
    });
  }

  /**
   * Sets up the agent socket namespace.
   */
  var ns = io.of('/agentsocket');
  ns.authorization(function(handshakeData, accept) {
    var query = handshakeData.query;
    if (query.clientType === 'client')
      if (!query.userId)
        return accept(null, false);
    if (query.clientType === 'agent')
      if (!query.mac)
        return accept(null, false);
    log.info('Agent Socket Namespace accepting authorization.');
    accept(null, true);
  });

  ns.on('connection', function(socket) {
    var socketData = socket.handshake.query;
    log.info('Socket connected. Handshake query:', JSON.stringify(socketData, null, 2));
    socket.on('disconnect', function() {
      log.info('Socket disconnected. Handshake query: ', JSON.stringify(socketData, null, 2));
    });

    /**
     * If this is a Client (web client, initiating wakeup)..
     */
    if (socketData.clientType === 'client') {
      setupClientSocket(socket);
    }
    /**
     * If this is an Agent (device that does the actual wakeup)..
     */
    else if (socketData.clientType === 'agent') {
      setupAgentSocket(socket);
    }
  });
  io.ns = ns;
};
