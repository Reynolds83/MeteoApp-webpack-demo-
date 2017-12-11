const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const scsslint = require('gulp-scss-lint');


gulp.task('watch_scss', ['sass'], function() {
    gulp.watch("./scss/**/*.scss", ['sass'])
        .on('change', function(event) {
        console.log('File ' + event.path.slice(event.path.indexOf('/scss/'),event.path.length) + ' was ' + event.type + ', running tasks...');
    });
});


gulp.task('sass_lint', () => {
    return gulp.src(["./scss/**/*.scss", '!./scss/partials/_normalize.scss'])       
        .pipe(scsslint({
            'config': './scss/.scss-lint.yml',
            'reporterOutput': './scss/scssReport.json',
            'reporterOutputFormat': 'Checkstyle'    
        }))
});


gulp.task('sass', ['sass_lint'], () => {
    return gulp.src("./scss/**/*.scss")        
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/stylesheets"));
});


gulp.task('css', ['watch_scss']);