/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
'use strict';
var agentSocketNsSetup = require("../lib/agent_socket_ns");
module.exports.bootstrap = function(cb) {
    agentSocketNsSetup(sails);
    
    cb();
};