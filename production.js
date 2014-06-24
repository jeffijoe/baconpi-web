'use strict';
var forever = require('forever-monitor');

var child = new forever.Monitor('app.js', {
  max: 3,
  silent: true,
  options: []
});

child.on('exit', function() {
  console.log('App has exited after 3 restarts');
});

child.start();