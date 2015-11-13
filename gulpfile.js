/**
 * Created by Andreas on 11.11.2015.
 */
var gulp = require('gulp');

var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglifyJs = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
    js: ['./www/app/**/*.js'],
    css: ['./www/app/**/*.css'],
    html: ['./www/app/**/*.html'],
};

var browserSync = require('browser-sync').create();
// Static server
gulp.task('serve', function() {
    browserSync.init({
        files:  ["./www/app/*.css", "./www/app/*.js", "./www/app/*.html"],
        server: {
            baseDir: "./www",
            index: "index.html"
        }
    });
});

gulp.task('sass', function (done) {
    gulp.src('./www/css/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('minify-js', function () {
    gulp.src(['www/js/_app.js'
            , 'www/js/_services.js'
            , 'www/js/_controllers.js'])
        .pipe(concat('app.js'))
        .pipe(uglifyJs())
        .pipe(gulp.dest('www/js'));
});

gulp.task('default', ['serve']);
