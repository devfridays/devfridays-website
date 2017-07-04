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
gulp.task('server', () => {
    browserSync({
        server: {
            baseDir: "dist/"
        }
    });
});

// Watch SCSS files for changes, recompile, compress, autoprefixed
gulp.task('sass', () =>{
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

// Task for Reload BrowserSync
gulp.task('reload', () => {
    browserSync.reload();
});

// Watch SCSS & HTML files, run reload BrowserSync
gulp.task('watch', () => {
    gulp.watch('./_sass/**/*.scss', ['sass', 'dist-css', 'reload']);
    gulp.watch("./*.html", ['dist-html','reload']);
}); 

//Recreate dist/*.html 
gulp.task('dist-html', () => {
    del('./dist/*.html');
    gulp.src('./*.html').pipe(gulp.dest('./dist/'));
});

//Recreate /dist/assets/css/main.css 
gulp.task('dist-css', () => {
    del('./dist/assets/css/main.css');
    gulp.src('assets/css/main.css').pipe(gulp.dest('dist/assets/css/'));
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

// Task Delete dist folder
gulp.task('clean:dist', () => del('./dist'));

// Deploy build dist to branch gh-pages
gulp.task('gh-pages', () => {
    return gulp.src('./dist/**/*')
        .pipe(ghPages({
            force: true
        }));
});

// Deploy build dist to branch gh-pages
gulp.task('deploy', ['build', 'gh-pages']);

// Default task, running just `gulp`
gulp.task('default', runSequence('clean:dist', 'build', 'server', 'watch'));
