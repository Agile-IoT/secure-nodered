/*******************************************************************************
 *Copyright (C) 2017 UNI Passau, FBK.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    UNI Passau, FBK - initial API and implementation
 ******************************************************************************/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'client/*/**.js', 'package.jon', 'conf/**'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'client/*/**.js', 'package.jon', 'conf/**'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**.js', 'example/*.js']
    }
  });

  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('modify', [
    'jsbeautifier:modify',
    'jshint'
  ]);

  grunt.registerTask('verify', [
    'jsbeautifier:verify',
    'jshint'
  ]);
  // Default task(s).
  grunt.registerTask('default', ['verify']);

};
