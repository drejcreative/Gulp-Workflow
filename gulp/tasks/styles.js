var gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync'),
      svgSprite = require("gulp-svg-sprites"),
      filter    = require('gulp-filter'),
      svg2png   = require('gulp-svg2png'),
      spritesmith = require('gulp.spritesmith'),
      pxtorem = require('gulp-pxtorem');

// #Autiprefixer options
var autoprefixerOptions = {
  browsers: ['last 20 versions', '> 5%', 'Firefox ESR']
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
    gulp.task('spriteSvg', function () {
      return gulp.src('app/images/svg/*.svg')
            .pipe(svgSprite({
              //mode: "symbols"
            }))
            //.pipe(filter("app/images/**/*.svg"))    // # Filter out everything except the SVG file
            //.pipe(svg2png())                        // # Create a PNG
            .pipe(gulp.dest("app/images/icons"));
    });

};
