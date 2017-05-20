(function() {
    "use strict";

    var gulp = require('./gulp')([
        'styles',
        'browserSync',
        'optimization'
    ]);

    gulp.task('default', ['sync'], function(callback) {});
    gulp.task('build', ['fonts'], function(callback) {});

}());
