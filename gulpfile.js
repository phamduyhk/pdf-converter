var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

gulp.task("clean", function () {
    return del("./Client/build");
});

gulp.task('app', function () {
    return gulp.src([
            './Client/src/app/*.js',
            './Client/src/app/myApp.module.js',
            './Client/src/app/**/*.js',
            './Client/src/app/route/app.routes.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('./Client/build'));
});

gulp.task('vendor', function () {
    return gulp.src(mainBowerFiles({
            paths: './Client'
        }))
        .pipe(filter('**/*.js')) // it is up one level for some reason
        .pipe(concat('vendor.js'))
        .pipe(uglify()).on('error', function (e) {
            console.log(e);
        })
        .pipe(rename({
            extname: '.min.js'
        }))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('./Client/build'));
});