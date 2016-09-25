/**
 *
 * @description 编译scss, es6文件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const server = require('gulp-develop-server');

/**
 *
 * gulp sass: 编译上scss文件
 *
 */

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('matrixui.css'))
    .pipe(gulp.dest('./public/temp/'));
});

/**
 *
 * gulp babel: 编译es6文件
 *
 */

gulp.task('babel', function() {
  gulp.src('./public/scripts/index.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./public/temp/'));

  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('matrixui.js'))
    .pipe(gulp.dest('./public/temp/'));
});

/**
 *
 * gulp compile: 执行 gulp sass, gulp babel指令
 *
 */

gulp.task('compile', ['sass', 'babel']);
