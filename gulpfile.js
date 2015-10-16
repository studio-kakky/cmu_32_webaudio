var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var DESTDIR = 'dest/';

gulp.task('copy:reveal', function() {
  return gulp.src([
    'bower_components/reveal.js/css/**/*.*',
    'bower_components/reveal.js/js/**/*.*',
    'bower_components/reveal.js/lib/**/*.*',
    'bower_components/reveal.js/plugin/**/*.*'
  ],
  { base: 'bower_components/reveal.js/' })
  .pipe(gulp.dest(DESTDIR+'lib/reveal'));
});

gulp.task('copy:snapsvg', function() {
  return gulp.src([
    'bower_components/snap.svg/dist/snap.svg-min.js'
  ])
  .pipe(gulp.dest('demo/script/extlib/'));
});


gulp.task('copy:html', function() {
  return gulp.src('presentation/src/**/*.*')
    .pipe(gulp.dest(DESTDIR));
});

gulp.task('copy:img', function() {
  return gulp.src('presentation/img/**/*.*')
    .pipe(gulp.dest(DESTDIR+'img'));
});

gulp.task('build:demo', function() {
  return gulp.src(['demo/app/*.js'])
    .pipe(babel())
    .pipe(concat('demo.js'))
    .pipe(gulp.dest(DESTDIR + 'demo/js/'));
});

gulp.task('style:demo', function() {
  return gulp.src('demo/styles/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest(DESTDIR + 'demo/css'));
});

gulp.task('lib:demo', function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/underscore/underscore-min.js',
      'bower_components/backbone/backbone-min.js'
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(DESTDIR + 'demo/js'));
});

gulp.task('copy:demo_sound', function(cb){
  return gulp.src('demo/data/*.aac')
    .pipe(gulp.dest(DESTDIR + 'demo/data'),cb);
});

gulp.task('copy:demo_js', function(cb){
  return gulp.src('demo/lib/*.js')
    .pipe(gulp.dest(DESTDIR + 'demo/lib'),cb);
});

gulp.task('copy:termin',function(cb) {
  return gulp.src('demo/termin/**/*.*')
    .pipe(gulp.dest(DESTDIR + 'demo/termin'),cb);
});

gulp.task('copy:demo', ['build:demo','style:demo','lib:demo','copy:demo_sound','copy:termin','copy:demo_js'], function(cb) {
  return gulp.src(['demo/static/*.html',])
    .pipe(gulp.dest(DESTDIR + 'demo/'),cb);
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dest/'
        }
    });
});

gulp.task('browser-sync:demo', function() {
    browserSync({
        server: {
            baseDir: 'dest/demo/'
        }
    });
});

gulp.task('watch', function() {
  gulp.watch('presentation/src/**/*.*',['copy:html']);
  gulp.watch('demo/**/*.*',['copy:demo']);
});

gulp.task('watch:demo', function() {
  gulp.watch('demo/**/*.*',['copy:demo']);
});

gulp.task('default',['copy:html','copy:img','copy:demo','browser-sync','watch']);
gulp.task('dev:demo',['copy:html','copy:img','copy:demo','browser-sync:demo','watch']);
