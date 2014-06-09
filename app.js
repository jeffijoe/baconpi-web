'use strict';
var optimist = require('optimist');
optimist.argv.prod = true;
require('sails').lift(optimist.argv);
