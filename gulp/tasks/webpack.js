var gulp = require('gulp');
var config = require('../config');
var webpack = require('webpack');

gulp.task('webpack', function(){
	webpack({
		entry: config.webpack.src,
		output: {
			path: config.webpack.dest,
			filename: 'app.js'
		},
		plugins: [
			new webpack.ProvidePlugin({
				jQuery: "jquery",
				$: "jquery",
				jquery: "jquery"
			})
		]
	}, function(err, stats){
		if(err) console.log(err);
	});
});
