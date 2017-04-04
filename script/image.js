const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const recursive = require('./recursive');



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

const files = recursive.getFilePath('src/images/');
files.forEach((file, index) => {
	image(file, path.dirname(file).replace(/^src/, 'dest'));
});
