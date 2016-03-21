var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('build', function(){
	return sequence(
		'clean',
		['ejs', 'sass', 'copy']
	);
});
