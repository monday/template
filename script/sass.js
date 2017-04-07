const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const mkdirp = require('mkdirp');
const glob = require('glob');
const config = require('./config');
const obj = {};


// SASSのコンパイル & ファイルコピー
obj.compile = (filePath) => {
	const extension = path.extname(filePath);
	const filename = path.basename(filePath, extension);
	const dirname = path.dirname(filePath).replace(config.src, '');
	const dest = config.dest + dirname + '/' + filename + '.css';

	mkdirp(config.dest + dirname + '/', (err) => {
		if(err) {
			console.log('sass');
			console.log(err);
			return;
		}

		const file = fs.readFileSync(filePath, config.encoding);
		const data = sass.renderSync({
			data: file
		});

		fs.writeFileSync(dest, data.css);
	});
};

obj.dest = () => {
	glob(config.sass.src, (err, files) => {
		files.forEach((path, index) => {
			obj.compile(path);
		});
	});
};

module.exports = obj;
