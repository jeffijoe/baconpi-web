/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`,
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function(grunt) {
  'use strict';


  /**
   * CSS files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * By default, Sails also supports LESS in development and production.
   * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task
   * below for more options.  For this to work, you may need to install new
   * dependencies, e.g. `npm install grunt-contrib-sass`
   */

  var cssFilesToInject = [
    'css/imports.css',
    'css/vendor/**/*.css',
    'css/common.css',
    'css/**/*.css'
  ];


  var appJsFiles = [
    'js/vendor/require.js',
    'js/app/main.js'
  ];

  var siteJsFiles = [
    'js/vendor/jquery.js',
    'js/vendor/semantic.js'
  ];




  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  //
  // DANGER:
  //
  // With great power comes great responsibility.
  //
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  // Modify css file injection paths to use 
  cssFilesToInject = cssFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
  });

  // Modify js file injection paths to use 
  appJsFiles = appJsFiles.map(function(path) {
    return '.tmp/public/' + path;
  });


  siteJsFiles = siteJsFiles.map(function(path) {
    return '.tmp/public/' + path;
  });


  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-jst/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-less/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-coffee/tasks');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jade');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: './assets',
          src: ['**/*.!(coffee|less|jade)'],
          dest: '.tmp/public'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'www'
        }]
      }
    },

    jade: {
      compile: {
        options: {
          client: true,
          amd: true,
          namespace: false,
          compileDebug: false,
          wrapper: 'amd'
        },
        files: [{
          expand: true,
          cwd: 'assets/js/app',
          src: ['**/*.jade'],
          dest: '.tmp/public/js/app',
          ext: '.js'
        }]
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: '.tmp/public/js/app/',
          mainConfigFile: 'assets/js/app/config.js',
          name: '../vendor/almond', // assumes a production build using almond
          out: '.tmp/public/js/optimized.js',
          findNestedDependencies: true,
          include: ['config', 'app'],
          insertRequire: ['config', 'app'],
          optimize: 'none'
        }
      }
    },

    clean: {
      dev: ['.tmp/public/**'],
      build: ['www']
    },

    less: {
      dev: {
        files: [{
          expand: true,
          cwd: 'assets/css/',
          src: ['imports.less','*.less'],
          dest: '.tmp/public/css/',
          ext: '.css'
        }]
      }
    },

    concat: {
      css: {
        src: cssFilesToInject,
        dest: '.tmp/public/concat/production.css'
      },
      siteJs: {
        src: siteJsFiles,
        dest: '.tmp/public/concat/site.js'
      }
    },

    // TODO: Gotta fix this.
    uglify: {
      site: {
        src: ['.tmp/public/concat/site.js'],
        dest: '.tmp/public/min/site.js'
      },
      app: {
        src: ['.tmp/public/js/optimized.js'],
        dest: '.tmp/public/min/app.js'
      },
    },

    cssmin: {
      all: {
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.css'
      }
    },

    'sails-linker': {

      /*******************************************
       * Jade linkers
       *******************************************/

      devSiteJs: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/*!(app_layout).jade': siteJsFiles
        }
      },

      prodSiteJs: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/*!(app_layout).jade': ['.tmp/public/min/site.js']
        }
      },


      devAppJs: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/app_layout.jade': appJsFiles
        }
      },

      prodAppJs: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/app_layout.jade': ['.tmp/public/min/app.js']
        }
      },

      devStyles: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/*.jade': cssFilesToInject
        }
      },

      prodStyles: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production.css']
        }
      }
      /************************************
       * Jade linker end
       ************************************/
    },

    watch: {
      api: {

        // API files to watch:
        files: ['api/**/*'],
        options: {
          livereload: true
        }
      },
      assets: {

        // Assets to watch:
        files: [
          'assets/**/*',
          'views/**/*.jade',
          '!views/*.jade'
        ],

        // When assets are changed:
        tasks: ['compileAssets', 'linkAssets'],
        options: {
          livereload: true
        }
      }
    }
  });

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compileAssets',
    'linkAssets',
    'watch'
  ]);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jade',
    'less:dev',
    'copy:dev'
  ]);

  grunt.registerTask('linkAssets', [
    'sails-linker:devAppJs',
    'sails-linker:devSiteJs',
    'sails-linker:devStyles',
    'sails-linker:devAppJs',
    'sails-linker:devStyles'
  ]);


  // Build the assets into a web accessible folder.
  // (handy for phone gap apps, chrome extensions, etc.)
  grunt.registerTask('build', [
    'compileAssets',
    'linkAssets',
    'clean:build',
    'copy:build'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:dev',
    'compileAssets',
    'concat',
    'requirejs',
    'uglify',
    'cssmin',
    'sails-linker:prodAppJs',
    'sails-linker:prodSiteJs',
    'sails-linker:prodStyles',
    'sails-linker:prodAppJs',
    'sails-linker:prodStyles'
  ]);

  // When API files are changed:
  grunt.event.on('watch', function(action, filepath) {
    grunt.log.writeln(filepath + ' has ' + action);

    // Send a request to a development-only endpoint on the server
    // which will reuptake the file that was changed.
    var baseurl = grunt.option('baseurl');
    var gruntSignalRoute = grunt.option('signalpath');
    var url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

    require('http').get(url)
      .on('error', function(e) {
        console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
      });
  });

};
