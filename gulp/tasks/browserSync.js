var gulp        = require('gulp'),
    browserSync = require('browser-sync');

// #For old NodeJS versions
var Promise = require('es6-promise').polyfill();


module.exports = function() {

  gulp.task('sync', ['sass'], function() {

    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
    gulp.watch('app/images/svg/*.svg', ['spriteSvg']);

    browserSync.init({
      server: {
        baseDir: './app',
        routes: {
            '/bower_components': 'bower_components'
        }
      },
      port: 4000,
      notify: false,
      ui: {
        port: 4001
      }
    });
  });

};
