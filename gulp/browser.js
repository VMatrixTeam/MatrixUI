/**
 *
 * @description 启动或刷新浏览器
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpsync = require('gulp-sync')(gulp);

/**
 *
 * gulp browser-sync: 同步刷新浏览器
 *
 */

gulp.task('browser-sync', function() {
  browserSync.init({
      proxy: "http://localhost:8099"
  });
});

/**
 *
 * gulp browser-reload: 刷新浏览器
 *
 */

gulp.task('browser-reload', function() {
  browserSync.reload();
});

gulp.task('browser-reload:sass', ['sass'], function() {
  browserSync.reload();
});

gulp.task('browser-reload:babel', ['babel'], function() {
  browserSync.reload();
});
