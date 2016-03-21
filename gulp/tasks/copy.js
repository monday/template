var gulp = require('gulp');
var config = require('../config');
var domain = config.domain;
var bs = require('browser-sync').get(domain);// browserSyncインスタンス

gulp.task('copy', function(){
	return gulp.src(config.copy.src, {base: config.src})
		.pipe(gulp.dest(config.dest))
		.pipe(bs.stream());//livereload
});
