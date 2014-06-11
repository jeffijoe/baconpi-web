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
  /**
   * Finds an agent socket based on it's MAC
   */
  function getAgentSocketByMacAddress(agentMac) {
    return _.find(agentNamespace.clients(), function(socket) {
      var data = socket.handshake.query;
      return (data.clientType === 'agent' && data.mac === agentMac);
    });
  }

  /**
   * Finds an agent socket based on it's user ID.
   */
  function getAgentSocketsByUserId(userId) {
    return _.filter(agentNamespace.clients(), function(socket) {
      var data = socket.handshake.query;
      return (data.clientType === 'agent' && data.userId === userId);
    });
  }


  /**
   * Gets all client sockets with a particular user ID.
   */
  function getClientSockets(userId) {
    return _.filter(agentNamespace.clients(), function(socket) {
      var data = socket.handshake.query;
      return (data.clientType === 'client' && data.userId === userId);
    });
  }

  /**
   * Bubbles the event up to any associated client sockets.
   */
  function bubbleToClientSockets(socket, eventName) {
    socket.on(eventName, function(data) {
      // The userId is set by the notifyClientSockets... call
      getClientSockets(socket.handshake.query.userId).forEach(function(socket) {
        socket.emit(eventName, data);
      });
    });
  }

  /**
   * Sets up the client socket events.
   */
  function setupClientSocket(socket) {
    var connectedAgents = getAgentSocketsByUserId(socket.handshake.query.userId).map(function(agentSocket) {
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
        var agentSocket = getAgentSocketByMacAddress(agent.macAddress);
        if(!agentSocket) {
          socket.emit('signal:error', {
            error: 'Agent does not appear to be connected.',
            computerId: data.computerId
          });
        } else {
          agentSocket.emit('wake', {
            mac: computer.macAddress,
            userId: computer.userId
          });  
        }
        
      });
    });


  }

  /**
   * Sets up the agent socket events.
   */
  function setupAgentSocket(socket) {
    // Alarm any client sockets of this agent's connection.
    var existingSocket = getAgentSocketByMacAddress(socket.handshake.query.mac);
    if(existingSocket && existingSocket.id !== socket.id){
      console.log('Existing agent socket found, forcefully disconnecting it..');
      existingSocket.disconnect();
    }
    notifyClientSocketsOfAgentConnection(socket).then(function() {
      bubbleToClientSockets(socket, 'signal:send');
      bubbleToClientSockets(socket, 'signal:error');
      socket.on('disconnect', function() {
        getClientSockets(socket.handshake.query.userId).forEach(function(clientSocket) {
          clientSocket.emit('agent:disconnect', {
            agentId: socket.handshake.query.agentId
          });
        });
      });
    });
  }

  /**
   * Notifies all connected clients that owns this agent of it's connection.
   * It also associates a user ID with the socket.
   * TODO: Refactor to use rooms.
   */
  function notifyClientSocketsOfAgentConnection(agentSocket) {
    var agentMac = agentSocket.handshake.query.mac;
    return Q(Agent.findOneByMacAddress(agentMac)).then(function(agent) {
      if (!agent) throw new Error('Agent with mac "' + agentMac + '" not found.');

      getClientSockets(agent.userId).forEach(function(socket) {
        agentSocket.handshake.query.userId = agent.userId;
        agentSocket.handshake.query.agentId = agent.id;
        socket.emit('agent:connect', {
          agentId: agent.id
        });
      });
    }).
    catch (function(err) {
      console.log(err);
    });
  }

  /**
   * Sets up the agent socket namespace.
   */
  var agentNamespace = io.of('/agentsocket');
  agentNamespace.authorization(function(handshakeData, accept) {
    var query = handshakeData.query;
    if (query.clientType === 'client')
      if (!query.userId)
        return accept(null, false);
    if (query.clientType === 'agent')
      if (!query.mac)
        return accept(null, false);

    accept(null, true);
  });

  agentNamespace.on('connection', function(socket) {
    var socketData = socket.handshake.query;
    console.log('Socket connected. Handshake:', JSON.stringify(socketData));
    socket.on('disconnect', function() {
      console.log('Socket disconnected.');
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
  io.agentNamespace = agentNamespace;
};
