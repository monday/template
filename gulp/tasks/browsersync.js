var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').create(config.domain);

gulp.task('browsersync', function(){
	bs.init({
		server: {
			baseDir: './dest',
			index: 'index.html'
		},
		//proxy: {
		//	target: config.bs.domain // ローカル環境構築済みの場合はproxyする
		//},
		notify: false,
		//logLevel: 'debug',
		logConnections: true
	});

	// watch
	gulp.watch(config.ejs.watch, ['ejs']);
	gulp.watch(config.sass.src, ['sass']);
	gulp.watch(config.webpack.watch, ['webpack']);
	gulp.watch(config.copy.src, ['copy']);
});
