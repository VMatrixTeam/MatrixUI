/**
 *
 * @description 构建性编辑，产生压缩后的文件
 * @author 吴家荣 <jiarongwu.se@foxmail.com>
 *
 */

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const gulpsync = require('gulp-sync')(gulp);
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

gulp.task('build:sass', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('matrixui.css'))
    .pipe(gulp.dest('./dist/'))
    .pipe(cleanCSS())
    .pipe(concat('matrixui.min.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build:babel', function() {
  gulp.src('./public/scripts/index.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/'));

  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('matrixui.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(concat('matrixui.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', gulpsync.sync(['build:sass', 'build:babel']));
