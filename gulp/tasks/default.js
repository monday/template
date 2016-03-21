var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('default', function(){
	return sequence(
		'build',
		'browsersync'
	);
});
