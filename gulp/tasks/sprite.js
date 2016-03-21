var gulp = require('gulp');
var sprite = require('gulp.spritesmith');
var config = require('../config');
var domain = config.domain;
var bs = require('browser-sync').get(domain);// browserSyncインスタンス

gulp.task('sprite', function(){
	var spriteData = gulp.src(config.sprite.src)
		.pipe(sprite({
			imgName: '../images/sprite.png',
			cssName: '_sprite.scss'
		}));
	var imgStream = spriteData.img
		.pipe(gulp.dest(config.sprite.dest.image))
		.pipe(bs.stream());//livereload

	var cssStream = spriteData.css
		.pipe(gulp.dest(config.sprite.dest.stylus))
		.pipe(bs.stream());//livereload

});
