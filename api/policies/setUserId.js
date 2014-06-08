/**
/**
 * setUserId
 *
 * @module      :: Policy
 * @description :: Sets the user ID of the request body.
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
'use strict';
module.exports = function(req, res, next) {
  req.body.userId = req.session.userId;
  next();
};
