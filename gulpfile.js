const gulp = require('gulp')
const connect = require('gulp-connect')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const rename = require("gulp-rename");
const stripDebug = require('gulp-strip-debug');
const gutil = require('gulp-util');

gulp.task('connect', function() {
  	connect.server({
	    root: './',
	    port: 8080,
	    livereload: true
  	});
});

gulp.task('html', function () {
  	gulp.src('./test/*.html')
    	.pipe(connect.reload());
});

gulp.task('babel', () =>
    gulp.src('./src/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./dist'))
);

gulp.task('watch', function () {
  	gulp.watch(['./app/*.html'], ['html']);
    gulp.watch(['./src/*.js'], ['babel']);
  	gulp.watch(['./src/*.js'], ['html']);
});

gulp.task('default', ['connect', 'watch','babel']);


gulp.task('test', () =>
    gulp.src('./src/*.js')
        .pipe(gulp.dest('./dist'))
        .pipe(stripDebug())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({suffix: '.test'}))
        .pipe(gulp.dest('./dist'))
);

gulp.task('build', () =>
    gulp.src('./src/*.js')
        .pipe(gulp.dest('./dist'))
        .pipe(stripDebug())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify({ mangle: false })) 
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'))
);



