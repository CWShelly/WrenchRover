const gulp = require('gulp');
// const eslint = require('gulp-eslint');
// const mocha = require('gulp-mocha');
// const protractor = require('gulp-protractor').protractor;
const webpack = require('webpack-stream');
const gulpNgConfig = require('gulp-ng-config');
var b2v = require('buffer-to-vinyl');
// const KarmaServer = require('karma').Server;

console.log(process.env.GMAP);
var files = {
  server: ['server/**/*.js', 'index.js', 'gulpfile.js'],
  app: ['app/**/*.js'],
  serverTest: ['test/**/*test.js']
};

gulp.task('make-config', () => {
  var json = JSON.stringify({
      string: process.env.GMAP
  });
      return b2v.stream(new Buffer(json), 'config.js')
    .pipe(gulpNgConfig('wrApp.config'))
    .pipe(gulp.dest('app'));
  });

gulp.task('configEnv', () => {

  gulp.src('config.json')
  .pipe(gulpNgConfig('wrApp.config'))
  .pipe(gulp.dest('app'));
});

gulp.task('config', () => {
  gulp.src('config.json')
      .pipe(gulpNgConfig('uiApp', configureSetup))
      .pipe(gulp.dest('app'));
});
// lint tasks
gulp.task('lint:server', () => {
  return gulp.src(files.server)
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('lint:app', () => {
  return gulp.src(files.app)
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('lint', ['lint:server', 'lint:app']);

// build dev tasks
gulp.task('webpack:dev', () => {

  return gulp.src('app/js/entry.js')
  .pipe(webpack({
    devtool: 'source-map',
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('./build'));
});

gulp.task('static:dev', () => {
  return gulp.src('app/**/*.html')
  .pipe(gulp.dest('./build'));
});

gulp.task('css:dev', () => {
  gulp.src('app/css/**/*.css')
  .pipe(gulp.dest('./build'));
});

gulp.task('font:dev', () => {
  gulp.src('app/css/**/*')
  .pipe(gulp.dest('./build/'));
});


gulp.task('images:dev', () => {
  return gulp.src('app/images/**/**')
  .pipe(gulp.dest('./build/images/'));
});

gulp.task('build', ['webpack:dev', 'static:dev', 'font:dev', 'images:dev']);

// build test task
gulp.task('webpack:test', ['lint'], () => {
  return gulp.src('test/unit/test_entry.js')
  .pipe(webpack({
    devtool: 'source-map',
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('./test'));
});

// test tasks
gulp.task('mocha', () => {
  return gulp.src(files.serverTest)
  .pipe(mocha());
});

gulp.task('karma', ['webpack:test'], (done) => {
  new KarmaServer({
    configFile: __dirname + '/karma.config.js'
  }, done).start();
});

gulp.task('test', ['mocha', 'karma']);


gulp.task('default', ['make-config', 'build']);
