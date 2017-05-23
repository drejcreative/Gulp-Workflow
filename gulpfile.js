(function() {
    "use strict";

    var gulp = require('./gulp')([
        'styles',
        'browserSync',
        'optimization'
    ]);

    gulp.task('default', ['sync', 'spriteSvg'], function() {});
    gulp.task('build', ['sass', 'spriteSvg', 'fonts'], function() {});

}());
