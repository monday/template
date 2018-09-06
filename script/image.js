'use strict';
const config = require('./config');
const path = require('path');
const glob = require('glob');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');



// imageminでpngとjpgを圧縮する
const image = (input, output) => {
	imagemin([input], output, {
		plugins: [
			imageminMozjpeg(),
			imageminPngquant({quality: '65-80'})
		]
	}).then(files => {
		//console.log(files);
		//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
	})
};


glob('src/**/*.@(' + config.copy.images.join('|') + ')', (err, files) => {
	files.forEach((file, index) => {
		image(file, path.dirname(file).replace(config.src, config.dest));
	});
});
