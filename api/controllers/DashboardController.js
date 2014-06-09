/**
 * DashboardController
 *
 * @module      :: Controller
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
/*global User, Agent*/
'use strict';
var Q = require('q');
module.exports = {

  index: function(req, res) {
    var session = req.session;
    Q.all([
      Q(User.findOne(session.userId)),
      Q(Agent.find({userId: session.userId}))
    ]).then(function (user, agents) {
      if (!user)
        return res.redirect('/account');
      return res.view({
        currentUser: user,
        agents: agents
      });
    }).catch(function (err) {
      console.log(err);
      res.send(500, err);
      throw err;
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DashboardController)
   */
  _config: {}


};
