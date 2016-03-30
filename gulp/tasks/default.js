var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('default', function(callback){
	return sequence(
		'build',
		'browsersync',
		callback
	);
});
