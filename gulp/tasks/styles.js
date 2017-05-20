var gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
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
      svgSprite = require("gulp-svg-sprites"),
      filter    = require('gulp-filter'),
      svg2png   = require('gulp-svg2png'),
      spritesmith = require('gulp.spritesmith'),
      imgRetina = require('gulp-img-retina'),
      pxtorem = require('gulp-pxtorem'),
      notify = require('gulp-notify'),
      $ = require('gulp-load-plugins')({lazy: true});

// #For old NodeJS versions
var Promise = require('es6-promise').polyfill();

// #Autiprefixer options
var autoprefixerOptions = {
  browsers: ['last 20 versions', '> 5%', 'Firefox ESR']
};

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

var pxtoremOptions = {
    replace: false
};

module.exports = function() {

    // #Scss with Autoprefixer - Adding all cross browser prefixes
    gulp.task('sass', function() {
      return gulp.src('app/scss/**/*.scss')       // # Gets all files ending with .scss in app/scss and children dirs
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))  // # Passes it through a gulp-sass
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))  // # Adding cross browser prefixes
        .pipe(pxtorem(pxtoremOptions))            // # Converting PX to Rem with px fallback for older browsers
        .pipe(gulp.dest('app/css'))               // # Outputs it in the css folder
        .pipe(browserSync.reload({
          stream: true
        }));
    });

    //Creating sprites from svg vector images
    gulp.task('spriteSvg', ['spriteSvg'], function () {
      return gulp.src('app/images/svg/*.svg')
            .pipe(svgSprite({
              //mode: "symbols"
            }))
            .pipe(gulp.dest("app/images/icons"))    // # Write the sprite-sheet + CSS + Preview
            //.pipe(filter("app/images/**/*.svg"))    // # Filter out everything except the SVG file
            //.pipe(svg2png())                        // # Create a PNG
            .pipe(gulp.dest("app/images/icons"));
    });
    
};
