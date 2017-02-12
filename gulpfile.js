var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var svgSprite = require("gulp-svg-sprites");
var filter    = require('gulp-filter');
var svg2png   = require('gulp-svg2png');
var spritesmith = require('gulp.spritesmith');
var runSequence = require('run-sequence');
var imgRetina = require('gulp-img-retina');
var pxtorem = require('gulp-pxtorem');
var $ = require('gulp-load-plugins')({lazy: true});

//For old NodeJS versions
var Promise = require('es6-promise').polyfill();

// ... variables
var autoprefixerOptions = {
  browsers: ['last 20 versions', '> 5%', 'Firefox ESR']
};

var pxtoremOptions = {
    replace: false
};

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app',
      routes: {
        "/bower_components": "bower_components"
      }
    },
    port: 8080
  });
});

//Scss with Autoprefixer - Adding all cross browser prefixes
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions)) // Adding cross browser prefixes
    .pipe(pxtorem(pxtoremOptions))
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Watchers for our changes
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/**/*.js', browserSync.reload);
});

//Creating sprites from svg vector images
gulp.task('spriteSvg', function () {
  return gulp.src('app/images/svg/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("app/images/icons"))  // Write the sprite-sheet + CSS + Preview
        .pipe(filter("app/images/**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())                      // Create a PNG
        .pipe(gulp.dest("app/images/icons"));
});


// Optimization Tasks
// ------------------

// Optimizing JavaScript for Angular with custom file load
/*
gulp.task('scripts', function() {
  return gulp.src(['app/js/angular.js',
                   'app/js/angular-animate.min.js',
                   'app/js/main.js',
                   'app/components/classifieldFactory.js',
                   'app/components/classifieldCtr.js',
                   'app/components/new/classifield.newCtr.js',
                   'app/components/edit/classifield.editCtr.js'])
    .pipe(concat('js/main.min.js'))
    .pipe(ngAnnotate())
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});
*/

// Optimizing and concating all JavaScript files to one
gulp.task('scripts', function() {
  return gulp.src('app/**/*.js')
    .pipe(concat('js/main.min.js'))
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

// Optimizing HTML and CSS files
gulp.task('useref', function() {
  return gulp.src('app/**/*.html')
    .pipe(imgRetina()) // Adding retina display version images
    .pipe(useref())
    .pipe(gulpIf('app/css/**/*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});


// Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'));
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

// Cleaning
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});


// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'],
  'watch',
    callback
  );
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['scripts', 'useref', 'images', 'fonts'],
    callback
  );
});
