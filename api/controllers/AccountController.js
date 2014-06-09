/**
 * AccountController
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
/*global User*/
'use strict';
var Q = require('q'),
    _ = require('lodash'),
    bcrypt = require('bcrypt-nodejs');
module.exports = {

  /**
   * Index
   */
  index: function(req, res) {
    res.view();
  },
  
  /**
   * Signs in the user
   */
  doSignin: function (req, res) {
    var user;
    Q(User.findOneByEmail(req.body.email)).then(function (foundUser) {
      if(! foundUser) {
        return res.view('account/index', {
          errors: ['Did not find an account with that email address.']
        });
      }
      user = foundUser;
      return Q.nfcall(bcrypt.compare, req.body.password, user.password);
    })
    .then(function (match) {
      if(match !== true){
        return res.view('account/index', {
          errors: ['Password was incorrect.']
        });
      }
      req.session.userId = user.id;
      return res.redirect('/agents');
    })
    .catch(function (err) {
      res.serverError(err);
    });
  },
  
  /**
   * Sign out of the system.
   */
  signout: function (req, res) {
    req.session.userId = null;
    if(req.session.destroy)
      req.session.destroy();
    req.session = null;
    res.redirect('/account');
  },
  
  /**
   * Create Account view.
   */
  signup: function(req, res) {
    res.view();
  },

  /**
   * Create the account.
   */
  doSignup: function(req, res) {
    var data = req.body;
    Q(User.findOneByEmail(data.email)).then(function(user) {
      if (user) {
        return res.view('account/signup', {
          errors: ['Email already in use.']
        });
      }
      return Q(User.create(data));
    })
    .then(function (user) {
      req.session.userId = user.id;
      return res.redirect('/agents');
    })
    .catch(function(err) {
      res.serverError(err);
    });
  },
  
  /**
   * Updates the details of the current account.
   */
  updateDetails: function (req, res) {
    var data = req.body;
    delete data.password; // Don't try anything fancy schmancy here.
    var currentUserId = req.session.userId;
    var user;
    Q(User.findOne(currentUserId)).then(function (foundUser) {
      user = foundUser;
      if(!user)
        return res.notFound();
      _.extend(user, data);
      return Q.nfcall(user.save.bind(user));
    }).then(function () {
      return res.json(user);
    }).fail(function (err) {
      res.serverError(err);
    });
  },
  
  /**
   * Change password
   */
  changePassword: function (req, res) {
    var data = req.body;
    var currentUserId = req.session.userId;
    var user;
    Q(User.findOne(currentUserId)).then(function (foundUser) {
      user = foundUser;
      if(!user)
        return res.notFound();
      
      return Q.nfcall(bcrypt.compare, data.oldPassword, user.password);
    }).then(function (match) {
      if(!match){
        return res.status(400).json({error: 'Old password was not correct.'});
      }
      return user.changePassword(data.newPassword).then(function () {
        return res.json({success:true});
      });
    }).fail(function (err) {
      res.serverError(err);
    });
  },
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AccountController)
   */
  _config: {}


};
