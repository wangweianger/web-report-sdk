const gulp = require('gulp')
const connect = require('gulp-connect')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const rename = require("gulp-rename");
const stripDebug = require('gulp-strip-debug');

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


gulp.task('build', () =>
    gulp.src('./dist/performance-report.js')
        .pipe(stripDebug())
        .pipe(uglify()) 
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'))
);





