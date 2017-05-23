var gulp = require('gulp'),
      babel = require('gulp-babel'),
      sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync'),
      useref = require('gulp-useref'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      ngAnnotate = require('gulp-ng-annotate'),
      gulpIf = require('gulp-if'),
      cssnano = require('gulp-cssnano'),
      imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
      del = require('del'),
      imgRetina = require('gulp-img-retina'),
      pxtorem = require('gulp-pxtorem'),
      notify = require('gulp-notify'),
      $ = require('gulp-load-plugins')({lazy: true});

// Push Errors
var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);
  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  // Keep gulp from hanging on this task
  this.emit('end');
};

module.exports = function() {
    // Optimization Tasks
    // ------------------

    // Optimizing and concating all JavaScript files to one
    gulp.task('scripts', ['clean:dist'], function() {
      return gulp.src('app/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: ['es2015']
        }))
        .on('error', interceptErrors)
        .pipe(concat('js/main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
    });

    // Optimizing CSS files
    gulp.task('styles', ['scripts'], function() {
      return gulp.src('app/css/**/*.css')
        .pipe(imgRetina()) // Adding retina display version images Example: <img src="images/default/example.jpg" alt="example image" srcset="images/default/example.jpg 1x, images/default/example@2x.jpg 2x, images/default/example@3x.jpg 3x" />
        .pipe(concat('css/main.min.css'))
        .pipe(useref())
        .pipe(gulpIf('css/main.min.css', cssnano()))
        .pipe(gulp.dest('dist'));
    });

    // Optimizing HTML files
    gulp.task('useref', ['styles'], function() {
      return gulp.src('app/**/*.html')
        .on('error', interceptErrors)
        .pipe(imgRetina())
        .pipe(useref())
        .pipe(gulpIf('js/main.min.js', uglify()))
        .pipe(gulpIf('css/main.min.css', cssnano()))
        .pipe(gulp.dest('dist'));
    });

    // Optimizing Images
    gulp.task('images', ['useref'], function() {
      return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
          interlaced: true,
        })))
        .pipe(gulp.dest('dist/images'));
    });

    // Copying fonts
    gulp.task('fonts', ['images'], function() {
      return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    });

    gulp.task('clean:dist',  function() {
      return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
    });

};
