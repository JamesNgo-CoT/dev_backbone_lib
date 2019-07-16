const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const concat = require('gulp-concat');

function cleanup() {
  return del('./dist/');
}

function buildJs() {
  return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildJs) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest('./dist/'))
    .pipe(concat('dev_backbone_lib.js'))
    .pipe(gulp.dest('./dist/'));
}

function copyScss() {
  return gulp.src('./src/**/*.scss', { since: gulp.lastRun(copyScss) })
    .pipe(gulp.dest('./dist/'));
}

exports.default = gulp.series(cleanup, gulp.parallel(buildJs, copyScss));
