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
    .pipe(gulp.dest('./dist/'));
}

function buildJsMerge() {
  return gulp.src([
    './src/util.js',
    './src/core_override.js',
    './src/backbone.js',
    './src/basemodel.js',
    './src/basecollection.js',
    './src/baseview.js',
    './src/baserouter.js',
    './src/authmodel.js',
    './src/comp/alert.js',
    './src/comp/datatable.js',
    './src/comp/dialog.js',
    './src/comp/form.js',
    './src/comp/highlighted.js',
    './src/comp/loginbutton.js',
    './src/comp/logindialog.js',
    './src/comp/loginform.js',
    './src/comp/nav.js'
  ], { since: gulp.lastRun(buildJsMerge) })
    .pipe(concat('dev_backbone_lib.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest('./dist/'));
}

function copyScss() {
  return gulp.src('./src/**/*.scss', { since: gulp.lastRun(copyScss) })
    .pipe(gulp.dest('./dist/'));
}

exports.default = gulp.series(cleanup, gulp.parallel(buildJs, buildJsMerge, copyScss));
