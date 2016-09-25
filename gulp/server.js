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
 * gulp server: 启动服务器
 *
 */

gulp.task('server', function() {
  server.listen( { path: './server.js' } );
});

/**
 *
 * gulp server:restart: 重启server.js
 *
 */

gulp.task('server:restart', function() {
  server.restart(function() {
    gulp.start('browser-reload');
  });
});
