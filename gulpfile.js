var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var sass           = require('gulp-sass');
var prefix         = require('gulp-autoprefixer');
var merge          = require('merge-stream');
var imagemin       = require('gulp-imagemin');
var ghPages        = require('gulp-gh-pages');
var del            = require('del');
var runSequence    = require('run-sequence');

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

gulp.task('reload', function(){
    browserSync.reload();
});

// Watch SCSS & HTML files, run reload BrowserSync
gulp.task('watch', function() {
    gulp.watch('./_sass/**/*.scss', ['sass']);
    gulp.watch("./*.html", ['dist-html','reload']);
}); 

gulp.task('dist-html', () => {
    del('./dist/*.html');
    console.log('Deleted-Dist html');
    gulp.src('./*.html')
        .pipe(gulp.dest('./dist/'));
});

// Task to build to dist folder
gulp.task('build', () => {
    const task = () => {
        let markup = gulp.src('*.html')
            .pipe(gulp.dest('dist/'));

        let styles = gulp.src('assets/css/main.css')
            .pipe(gulp.dest('dist/assets/css/'));

        let images = gulp.src('assets/images/**/')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/assets/images/'));    

        let cname = gulp.src('./CNAME')
                .pipe(gulp.dest('dist/'));

        return merge(markup, styles, images, cname);
    }

    task();
});

// gulp.task('build', gulp.series('clean', 'coffee'))

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
gulp.task('default', function(){
  return runSequence('clean:dist', 'build', 'server', 'watch')
});

// gulp.series('clean:dist', 'build', 'server', 'watch'));
