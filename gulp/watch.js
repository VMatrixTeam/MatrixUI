/**
 *
 * @description 编译scss, es6文件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

'use strict';

const gulp = require('gulp');
const server = require('gulp-develop-server');
const gulpsync = require('gulp-sync')(gulp);

/**
 *
 * gulp watch: 监听代码文件变化
 *
 */

gulp.task('watch', gulpsync.sync([
  'compile',
  'server',
  'browser-sync'
]), function () {
  gulp.watch([
    './src/**/*.scss',
    './src/**/*.js',
    './views/**/*.jade',
    './public/scripts/*.js',
    './public/styles/*.css',
    './server.js'
  ], function(event) {
    if (event.path.endsWith('server.js')) {
      gulp.start('server:restart');
    }
    else if (event.path.endsWith('.scss')) {
      gulp.start('browser-reload:sass');
    }
    else if (event.path.endsWith('.js')) {
      gulp.start('browser-reload:babel');
    }
    else if (event.path.endsWith('.jade')) {
      gulp.start('browser-reload');
    } else {
      gulp.start('browser-reload');
    }
  });
});

/**
 *
 * gulp default: 默认命令
 *
 */

gulp.task('default', ['watch']);
