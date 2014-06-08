/**
 * Require.js Config file.
 */
'use strict';
require.config({
  baseUrl: '/js/app',
  urlArgs: 'v=' + (new Date()).getTime(),
  paths: {
    vendor: '../vendor',
    templates: '../templates/',
    backbone: '../vendor/backbone',
    lodash: '../vendor/lodash',
    underscore: '../vendor/lodash',
    jquery: '../vendor/jquery',
    marionette: '../vendor/backbone.marionette',
    semantic: '../vendor/semantic',
    'backbone.wreqr': '../vendor/backbone.wreqr',
    'backbone.babysitter': '../vendor/backbone.babysitter',
    'backbone.syphon': '../vendor/backbone.syphon',
    jade: '../vendor/jade-runtime',
    'socket-io': '../vendor/socket.io'
  },
  wrapShim: true,
  map: {
    '*': {
      'underscore': 'lodash'
    }
  },
  shim: {
    jquery: {
      exports: 'jQuery'
    },
    semantic: {
      exports: 'jQuery',
      deps: ['jquery']
    },
    lodash: {
      exports: '_'
    },
    'backbone': {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.wreqr': {
      deps: ['backbone']
    },
    'backbone.syphon': {
      deps: ['backbone']
    },
    'backbone.babysitter': {
      deps: ['backbone']
    },
    marionette: {
      deps: ['jquery', 'lodash', 'backbone', 'backbone.wreqr', 'backbone.babysitter'],
      exports: 'Marionette'
    }
  }
});
