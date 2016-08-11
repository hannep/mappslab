var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var pump = require('pump')

const child = require('child_process');
const gutil = require('gulp-util');

gulp.task('jekyll', function () {
  const jekyll = child.spawn('jekyll', ['serve',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = function (buffer) {
    buffer.toString()
      .split(/\n/)
      .forEach(function (message) {gutil.log('Jekyll: ' + message)});
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('sass', function () {
  return gulp.src('./_sass/main.scss')
    .pipe(sass({
    	includePaths: "./bower_components/foundation-sites/scss"
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('javascript', function (cb) {
  pump([
        gulp.src(['bower_components/foundation-sites/js/*.js', 'bower_components/jquery/dist/jquery.js']),
        wrap('// <%= file.path %>\n<%= contents %>'),
        concat('all.js'),
        gulp.dest('js')
    ]
  );
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./_sass/**/*.scss', ['sass']);
});

gulp.task('js:watch', function () {
  gulp.watch('./_javascript/**/*.scss', ['js']);
});

gulp.task('watch', ['js:watch', 'sass:watch'])

gulp.task('default', ['sass', 'javascript', 'jekyll', 'watch']);