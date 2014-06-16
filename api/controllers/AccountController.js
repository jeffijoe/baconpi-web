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
  bcrypt = require('bcrypt-nodejs'),
  sails = require('sails'),
  Recaptcha = require('recaptcha').Recaptcha;

var RECAPTCHA_PUBLIC_KEY = sails.config.recaptcha.publicKey,
    RECAPTCHA_PRIVATE_KEY = sails.config.recaptcha.privateKey,
    MAX_USER_COUNT = 500;

module.exports = {

  /**
   * Index
   */
  index: function(req, res) {
    if (req.session.userId)
      return res.redirect('/agents');
    
    res.view();
  },

  /**
   * Signs in the user
   */
  doSignin: function(req, res) {
    var user;

    Q(User.findOneByEmail(req.body.email)).then(function(foundUser) {
      if (!foundUser) {
        return res.view('account/index', {
          errors: ['Did not find an account with that email address.']
        });
      }
      user = foundUser;
      return Q.nfcall(bcrypt.compare, req.body.password, user.password);
    }).then(function(match) {
      if (match !== true) {
        return res.view('account/index', {
          errors: ['Password was incorrect.']
        });
      }
      req.session.userId = user.id;
      return res.redirect('/agents');
    }).fail(function(err) {
      res.serverError(err);
    });
  },

  /**
   * Sign out of the system.
   */
  signout: function(req, res) {
    req.session.userId = null;
    if (req.session.destroy)
      req.session.destroy();
    req.session = null;
    res.redirect('/account');
  },

  /**
   * Create Account view.
   */
  signup: function(req, res) {
    var recaptcha = new Recaptcha(RECAPTCHA_PUBLIC_KEY, RECAPTCHA_PRIVATE_KEY, req.secure);

    res.view({
      recaptcha: recaptcha.toHTML()
    });
  },

  /**
   * Create the account.
   */
  doSignup: function(req, res) {
    var data = req.body;
    var recaptchaData = {
      remoteip: req.connection.remoteAddress,
      challenge: req.body.recaptcha_challenge_field,
      response: req.body.recaptcha_response_field
    };
    var recaptcha = new Recaptcha(RECAPTCHA_PUBLIC_KEY, RECAPTCHA_PRIVATE_KEY, recaptchaData, req.secure);
    recaptcha.verify(function(success) {
      if (!success) {
        return res.view('account/signup', _.extend({
          recaptcha: recaptcha.toHTML(),
          errors: ['That captcha was incorrect. Try again.']
        }, data));
      }

      // We should not have to do this ever, but oh well..
      Q(User.find({})).then(function(users) {
        if (users.length >= MAX_USER_COUNT) {
          res.view('account/index', {
            errors: ['Apologies, but we already have '+MAX_USER_COUNT+' members. Please contact me when you see this, cause this is friggin awesome!']
          });
          throw true;
        }
        return Q(User.findOneByEmail(data.email));
      }).then(function(user) {
        if (user) {
          res.view('account/signup', _.extend({
            recaptcha: recaptcha.toHTML(),
            errors: ['Email already in use.']
          }, data));
          throw true;
        }
        return Q(User.create(data));
      }).then(function(user) {
        req.session.userId = user.id;
        return res.redirect('/agents');
      }).fail(function(err) {
        if (err !== true)
          res.serverError(err);
      });
    });
  },

  /**
   * Updates the details of the current account.
   */
  updateDetails: function(req, res) {
    var data = req.body;
    delete data.password; // Don't try anything fancy schmancy here.
    var currentUserId = req.session.userId;
    var user;
    Q(User.findOne(currentUserId)).then(function(foundUser) {
      user = foundUser;
      if (!user)
        return res.notFound();
      _.extend(user, data);
      return Q.nfcall(user.save.bind(user));
    }).then(function() {
      return res.json(user);
    }).fail(function(err) {
      res.serverError(err);
    });
  },

  /**
   * Change password
   */
  changePassword: function(req, res) {
    var data = req.body;
    var currentUserId = req.session.userId;
    var user;
    Q(User.findOne(currentUserId)).then(function(foundUser) {
      user = foundUser;
      if (!user)
        return res.notFound();

      return Q.nfcall(bcrypt.compare, data.oldPassword, user.password);
    }).then(function(match) {
      if (!match) {
        return res.status(400).json({
          error: 'Old password was not correct.'
        });
      }
      return user.changePassword(data.newPassword).then(function() {
        return res.json({
          success: true
        });
      });
    }).fail(function(err) {
      res.serverError(err);
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AccountController)
   */
  _config: {}


};
