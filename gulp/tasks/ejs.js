var gulp = require('gulp');
var ejs = require('gulp-ejs');
var plumber = require('gulp-plumber');
var config = require('../config');
var domain = config.domain;
var bs = require('browser-sync').get(domain);

gulp.task('ejs', function(){
	return gulp.src(config.ejs.src)
		.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
		.pipe(ejs({}, {"ext": ".html"}))
		.pipe(gulp.dest(config.ejs.dest))
		.pipe(bs.stream());//livereload
});
