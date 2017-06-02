var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var gulpCopy = require('gulp-copy');



// -----------------------------------------------------------
// DEV LIB
// -----------------------------------------------------------

gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8000,
        livereload: true
    });
});

// keeps gulp from crashing for scss errors
gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'));
});

gulp.task('livereload', function () {
    gulp.src('./**/*')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('./**/*', ['livereload']);
});

// -----------------------------------------------------------
// BUILDING LIB
// -----------------------------------------------------------

gulp.task('compress-main', function () {
    gulp.src(['js/app.js', 'js/core/*.js'])
        .pipe(concat('liftJs.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            ignoreFiles: ['.min.js', '-min.js']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress-modules', function () {
    gulp.src(['js/modules/*.js'])
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            ignoreFiles: ['.min.js', '-min.js']
        }))
        .pipe(gulp.dest('dist/modules'));
});

gulp.task('copy-libs', function () {
    gulp.src(['js/libs/*.js'])
        .pipe(gulp.dest('dist/libs'));
});


// -----------------------------------------------------------
// TASKS
// -----------------------------------------------------------

gulp.task('default', ['connect', 'sass', 'watch']);

gulp.task('build', ['sass', 'compress-main', 'compress-modules', 'copy-libs']);

gulp.task('prod', ['sass']);
