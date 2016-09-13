const fs = require("fs");
const gulp = require('gulp');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
const angularFilesort = require('gulp-angular-filesort');
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject(cb) {
  const dirs = fs.readdirSync(conf.path.src());
  for (var i = 0; i<dirs.length; i++) {

    var dir = dirs[i];

    var injectScripts = gulp.src([
      conf.path.tmp(dir+'/*.js')
    ]);

    var injectOptions = {
      ignorePath: [conf.paths.src, conf.paths.tmp,dir],
      addRootSlash: false
    };

    gulp.src(conf.path.src(dir+'/index.html'))
        //inject user-scripts
        .pipe(gulpInject(injectScripts, injectOptions))
        //inject bower-dependence
        .pipe(wiredep(Object.assign({}, conf.wiredep)))
        .pipe(gulp.dest(conf.paths.tmp+'/'+dir))
        .pipe(browserSync.stream());

  }
  cb();
}