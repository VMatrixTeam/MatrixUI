'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const server = require('gulp-develop-server');
const browserSync = require('browser-sync').create();
const gulpsync = require('gulp-sync')(gulp);
/**
 *
 * gulp sass: 编译上scss文件
 *
 */

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('matrixui.css'))
    .pipe(gulp.dest('./dist/'));
});

/**
 *
 * gulp babel: 编译es6文件
 *
 */

gulp.task('babel', function() {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('matrixui.js'))
    .pipe(gulp.dest('./dist/'));
});

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

/**
 *
 * gulp browser-sync: 同步刷新浏览器
 *
 */

gulp.task('browser-sync', function() {
  browserSync.init({
      proxy: "http://localhost:8080"
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


/**
 *
 * gulp watch: 监听代码文件变化
 *
 */

gulp.task('watch', gulpsync.sync(['server', 'browser-sync']), function () {
  gulp.watch(['./src/**/*.scss', './src/**/*.js', './index.jade', './server.js'], function(event) {
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
    }
  });
});

/**
 *
 * gulp default: 默认命令
 *
 */

gulp.task('default', ['watch']);
