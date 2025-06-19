module.exports = function (grunt) {

  // Task configuration
  grunt.initConfig({
    "pkg" : grunt.file.readJSON('package.json'),
    "SOME_ENV": process.env.SOME_ENV,
    "run": {
      "options": {
      },
      "format": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/code-format.sh' ]
      },
      "clean-build": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/clean-build.sh' ]
      },
      "build-client": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/build-client.sh' ]
      },
      "build-server": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/build-server.sh' ]
      },
      "lint": {
        "cmd": 'bash',
        "args": ['-c', './buildscripts/code-lint.sh' ]
      },
      "start": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/start.sh' ]
      },
      "docker-build": {
        "cmd": 'bash',
        "args": [ '-c', './dockerfiles/build.sh' ]
      }
    },
    "watch": {
      "client": {
        "files": [ 'client/src/**/*' ],
        "tasks": [ 'run:build-client' ],
        "options": {
          "spawn": true,
        },
      },
      "server": {
        "files": [ 'server/src/**/*' ],
        "tasks": [ 'run:build-server' ],
        "options": {
          "spawn": true,
          },
      },
      "service": {
        "files": [ 'build/.restart' ],
        "tasks": [ 'run:start' ],
        "options": {
          "spawn": true,
          },
      },
    },
    "nodemon": {
      "dev": {
       "script": './buildscripts/start.sh',
        "options": {
          "args": [],
          "nodeArgs": [],
          "callback": function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          },
          "env": { 
            "PORT": '3000'
          },
          "cwd": __dirname,
          "ignore": ['node_modules/**'],
          "ext": 'ts,vue',
          "watch": ['build/.restart'],
          "delay": 1000,
          "legacyWatch": false
        }
      }	
		    },
    "concurrent": {
      "dev": {
        "tasks": [ 'nodemon:dev', 'watch:client', 'watch:server' ],
        "options": {
          "logConcurrentOutput": true
        }
      }
    },
  });

  // Plugins
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Taskþu ]);
  grunt.registerTask('start', [ 'concurrent:dev' ]);
  grunt.registerTask('build-client', [ 'run:build-client' ]);
  grunt.registerTask('build-server', [ 'run:build-server' ]);
  grunt.registerTask('format', [ 'run:format' ]);
  grunt.registerTask('lint', ['format', 'run:lint' ])
  grunt.registerTask('docker', [ 'run:docker-build'])

  grunt.registerTask('default', [ 'run:format', 'build-server', 'build-client', 'concurrent:dev' ]);
}

