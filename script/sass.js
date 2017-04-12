const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const mkdirp = require('mkdirp');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const config = require('./config');
const obj = {};



// SASSのコンパイル & ファイルコピー
obj.compile = (filePath) => {
	const extension = path.extname(filePath);
	const filename = path.basename(filePath, extension);
	const dirname = config.dest + path.dirname(filePath).replace(config.src, '') + '/';
	const dest = dirname + filename + '.css';

	mkdirp(dirname, (err) => {
		if(err) {
			console.log('sass');
			console.log(err);
			return;
		}

		const file = fs.readFileSync(filePath, config.encoding);
		const data = sass.renderSync({
			data: file
		});
		const css = autoprefixer.process(data.css);

		fs.writeFileSync(dest, css);
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
