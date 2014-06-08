/**
 * Global adapter config
 *
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */
/*global process*/
'use strict';
module.exports.adapters = {

   // If you leave the adapter config unspecified 
   // in a model definition, 'default' will be used.
   'default': 'mongo',

   // Persistent adapter for DEVELOPMENT ONLY
   // (data is preserved when the server shuts down)
   disk: {
      module: 'sails-disk'
   },

   mongo: {
      module: 'sails-mongo',
      schema: true,
      url: process.env.OPENSHIFT_MONGODB_DB_URL ? process.env.OPENSHIFT_MONGODB_DB_URL+'baconpi': 'mongodb://localhost:27017/baconpi'
   }
};
