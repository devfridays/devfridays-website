var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var sass           = require('gulp-sass');
var prefix         = require('gulp-autoprefixer');
var merge          = require('merge-stream');
var imagemin       = require('gulp-imagemin');
var ghPages        = require('gulp-gh-pages');
var del            = require('del');

// Start Static Server with browserSync
gulp.task('server', ['sass'], function() {
    browserSync({
        server: {
            baseDir: "dist/"
        }
    });
});

// Watch SCSS files for changes, recompile, compress, autoprefixed
gulp.task('sass', function() {
    return gulp.src('./_sass/main.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(prefix(['last 2 versions'], {
            cascade: true
        }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Watch SCSS & HTML files, run reload BrowserSync
gulp.task('watch', function() {
    gulp.watch('./_sass/**/*.scss', ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Task to build to dist folder
gulp.task('build', () => {
    const task = () => {
        let markup = gulp.src('*.html')
            .pipe(gulp.dest('dist/'));

        let styles = gulp.src('assets/css/main.css')
            .pipe(gulp.dest('dist/css/'));

        let images = gulp.src('assets/images/**/')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/images/'));

        let cname = gulp.src('./CNAME')
                .pipe(gulp.dest('dist/'));

        return merge(markup, styles, images, cname);
    }

    task();
});

// Task Delete dist folder
gulp.task('clean:dist', function () {
  return del('./dist');
});

// Deploy build dist to branch gh-pages
gulp.task('gh-pages', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages({
            force: true
        }));
});

// Deploy build dist to branch gh-pages
gulp.task('deploy', ['build', 'gh-pages']);

// Default task, running just `gulp`
gulp.task('default', ['clean:dist', 'build', 'server', 'watch']);
