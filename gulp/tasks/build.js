var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('build', function(callback){
	return sequence(
		'clean',
		['ejs', 'sass', 'webpack', 'copy']
	);
});
