/**
 * User
 */
'use strict';
var bcrypt = require('bcrypt-nodejs'),
    Q = require('q');
module.exports = {
   
   attributes: {
      name: {
         type: 'string',
         required: true
      },
      email: {
         type: 'email',
         required: true
      },
      password: {
         type: 'string',
         required: true
      },
      toJSON: function() {
         var obj = this.toObject();
         delete obj.password;
         return obj;
      },
      changePassword: function (newPassword) {
         var user = this;
         return Q.nfcall(bcrypt.hash, newPassword, null, null).then(function (hashed) {
            user.password = hashed;
            return Q.nfcall(user.save.bind(user));
         }).then(function () {
            return user;
         }).catch(function (err) {
            throw err;
         });
      }
   },

   beforeCreate: function(values, next) {
      bcrypt.hash(values.password, null, null, function(err, hash) {
         if (err) return next(err);
         values.password = hash;
         next();
      });
   }

};
