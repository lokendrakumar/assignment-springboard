var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    less        = require('gulp-less'),
    cssnano     = require('gulp-cssnano'),
    del         = require('del'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    notify      = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('bower-js', function() {
    gulp.src(
        
        [   'bower_components/jquery/dist/jquery.min.js',
            'bower_components/selectize/dist/js/standalone/selectize.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-selectize2/dist/angular-selectize.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/ngstorage/ngStorage.min.js',
            "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        ])
        .pipe(concat('vendors.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('app/scripts/'))
        // .pipe(notify({ message: 'Bower components compiled' }));
});


gulp.task('scripts', function() {
    gulp.src(['master/src/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/scripts/'))
        // .pipe(notify({ message: 'All Scripts compiled' }));
});

gulp.task('styles', function() {
    gulp.src(['master/less/style.less',
                'bower_components/selectize/dist/css/selectize.default.css',
                'bower_components/bootstrap/dist/css/bootstrap.min.css',
                "bower_components/fontawesome/css/font-awesome.min.css",
                "bower_components/fontawesome/fonts/*"
            ])
        .pipe(less())
        .pipe(cssnano())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('app/styles/'))
        // .pipe(notify({ message: 'All Styles compiled' }));
});
gulp.task('views', function() {
    gulp.src('master/views/**/*.html')
        .pipe(gulp.dest('app/views/'))
        // .pipe(notify({ message: 'All HTML Files compiled' }));
});

gulp.task('index', function() {
    gulp.src('master/index.html')
        .pipe(gulp.dest(''))
        // .pipe(notify({ message: 'Index HTML compiled' }));
});
/**
 * **********************************
 * @default
 * Run default commands
 * **********************************
 */
gulp.task('default', function() {
    gulp.start( 'bower-js', 'scripts', 'styles', 'views', 'index', 'watch');
});
/**
 * **********************************
 * @watch
 * Watch for file changes and recompile as needed
 * **********************************
 */
gulp.task('watch', function() {

    // Watch .js files
    gulp.watch('master/src/**', ['bower-js', 'scripts']);

    // Watch .less files
    gulp.watch('master/less/**', ['styles']);
    // Watch views
    gulp.watch('master/views/**', ['views']);

    // Watch index file
    gulp.watch('master/index.html', ['index']);

});
