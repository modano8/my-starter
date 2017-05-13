/* gulpfile.js */

var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    nunjucksRender = require('gulp-nunjucks-render');

// Source and distribution folder
var
    source = 'src/',
    dest = 'dist/';

// Html source file
var html = {
    in: source + '*.html',
    out: dest,
    watch: source + '**/*.html'
};

// Js source file
var js = {
    in: [
            source + 'js/*.js',
            './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            './bower_components/jquery/dist/jquery.min.js'
        ],
    out: dest + 'js/',
    watch: source + 'js/*.js',
    partials: source + 'partials/**/*.js'
};

// Img source file
var img = {
    in: source + 'img/*.+(png|jpg)',
    out: dest + 'img/',
    watch: source + 'img/*.+(png|jpg)',
};

// Bootstrap scss source
var bootstrapSass = {
    in: './bower_components/bootstrap-sass/'
};

// Css source file: .scss files
var css = {
    in: [source + 'css/main.scss', source + 'css/custom.scss'],
    out: dest + 'css/',
    watch: source + 'css/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

// Server connect
gulp.task('connect', function () {
    connect.server({
        root: [dest],
        livereload: true
    });
});

// Copy html to dest
gulp.task('html', function () {
    return gulp
        .src(html.in)
        .pipe(gulp.dest(html.out));
});

// Copy js to dest
gulp.task('js', function () {
    return gulp
        .src(js.in)
        .pipe(gulp.dest(js.out));
});

// Copy js to dest
gulp.task('img', function () {
    return gulp
        .src(img.in)
        .pipe(gulp.dest(img.out));
});

// Icons
gulp.task('icons', function() {
    return gulp
            .src(bootstrapSass.in + 'assets/fonts/bootstrap/*.*' )
            .pipe(gulp.dest(dest + 'fonts/'));
});

// Compile scss
gulp.task('sass', function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
});

gulp.task('nunjucks', function () {
    // Gets .html and .nunjucks files in pages
    return gulp.src(source + 'pages/**/*.+(html|nunjucks)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: [source + 'templates']
        }))
        // output files in app folder
        .pipe(gulp.dest(dest))
});


// Build task
gulp.task('build', ['clean'], function () {
    gulp.start('sass', 'nunjucks', 'js', 'img', 'icons');
});

// Clean
gulp.task('clean', function () {
    return gulp.src(dest + '*', { read: false })
        .pipe(clean());
});

// Default task
gulp.task('default', ['connect', 'sass', 'nunjucks', 'js', 'img', 'icons'], function () {
    gulp.watch(css.watch, ['sass']);
    gulp.watch(html.watch, ['nunjucks']);
    gulp.watch(html.watch, ['js']);
    gulp.watch(html.watch, ['img']);
});