var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');

// Start Static Server with browserSync
gulp.task('browser-sync', ['sass', 'watch'], function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

// Watch SCSS files for changes, recompile, compress, autoprefixed
gulp.task('sass', function () {
    return gulp.src('_sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(prefix(['last 2 versions'], { cascade: true }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream:true}));
});

// Watch SCSS & HTML files, run reload BrowserSync
gulp.task('watch', function () {
    gulp.watch('_sass/*/*.scss', ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Default task, running just `gulp`
gulp.task('default', ['browser-sync', 'watch']);
