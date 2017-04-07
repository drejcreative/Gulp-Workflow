const gulp = require('gulp'),
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
      runSequence = require('run-sequence'),
      imgRetina = require('gulp-img-retina'),
      pxtorem = require('gulp-pxtorem'),
      $ = require('gulp-load-plugins')({lazy: true});

// #For old NodeJS versions
const Promise = require('es6-promise').polyfill();

// #Autiprefixer options
const autoprefixerOptions = {
  browsers: ['last 20 versions', '> 5%', 'Firefox ESR']
};

const pxtoremOptions = {
    replace: false
};

// #Start browserSync server
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
        .pipe(gulp.dest("app/images/icons"))    // # Write the sprite-sheet + CSS + Preview
        .pipe(filter("app/images/**/*.svg"))    // # Filter out everything except the SVG file
        .pipe(svg2png())                        // # Create a PNG
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
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))                                 // #3. transpile ES2015 to ES5 using ES2015 preset
    .pipe(concat('js/main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(useref())
    .pipe(gulpIf('js/main.min.js', uglify()))
    .pipe(gulpIf('app/css/**/*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing HTML and CSS files
gulp.task('styles', function() {
  return gulp.src('app/css/**/*.css')
    .pipe(imgRetina()) // Adding retina display version images Example: <img src="images/default/example.jpg" alt="example image" srcset="images/default/example.jpg 1x, images/default/example@2x.jpg 2x, images/default/example@3x.jpg 3x" />
    .pipe(concat('css/main.min.css'))
    .pipe(useref())
    .pipe(gulpIf('css/main.min.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing HTML and CSS files
gulp.task('useref', function() {
  return gulp.src('app/**/*.html')
    .pipe(useref())
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
    ['scripts', 'styles', 'useref', 'images', 'fonts'],
    callback
  );
});
