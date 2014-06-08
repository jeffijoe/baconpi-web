/**
 * AgentSocketController
 *
 * @module        :: Controller
 * @description   :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
'use strict';
module.exports = {    
    /**
     * Creates a session. Actually does nothing, but the Agent uses it to establish a session.
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    session: function (req, res) {
      res.send(200, '');
    },
    send: function (req, res) {
      var agentNamespace = sails.io.agentNamespace;
      var result = agentNamespace.clients().map(function (client) {
        return client.handshake.query.mac;
      });
      
      agentNamespace.emit('pie', {
        haveSome:'pie', 
        extra: req.query.extra
      });
      
      res.send(200, 'Clients: '+result.join(','));
    },
    
    _config: {}
};