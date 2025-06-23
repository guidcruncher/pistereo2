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
      "client": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/client.sh' ]
      },
      "server": {
        "cmd": 'bash',
        "args": [ '-c', './buildscripts/server.sh' ]
      },
      "lint": {
        "cmd": 'bash',
        "args": ['-c', './buildscripts/code-lint.sh' ]
      },
      "docker-build": {
        "cmd": 'bash',
        "args": [ '-c', './dockerfiles/build.sh' ]
      }
    },
    "concurrent": {
      "dev": {
        "tasks": [ 'run:server', 'run:client' ],
        "options": {
          "logConcurrentOutput": true
        }
      }
    },
  });

  // Plugins
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-concurrent');

  // Tasks ]);
  grunt.registerTask('build-client', [ 'run:build-client' ]);
  grunt.registerTask('build-server', [ 'run:build-server' ]);
  grunt.registerTask('format', [ 'run:format' ]);
  grunt.registerTask('lint', ['format', 'run:lint' ])
  grunt.registerTask('docker', [ 'run:docker-build'])

  grunt.registerTask('default', [ 'run:format', 'concurrent:dev' ]);
}

