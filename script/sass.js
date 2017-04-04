const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const mkdirp = require('mkdirp');
const config = require('./config');
const obj = {};


// SASSのコンパイル & ファイルコピー
obj.compile = (filePath) => {
	const extension = path.extname(filePath);
	const filename = path.basename(filePath, extension);
	const dirname = path.dirname(filePath).replace(/src/, '');
	const dest = config.dest + dirname + '/' + filename + '.css';

	mkdirp(config.dest + dirname + '/', function(err){
		if(err) {
			console.log(this.name);
			console.log(err);
			return;
		}

		const file = fs.readFileSync(filePath, 'utf8');
		const data = sass.renderSync({
			data: file
		});

		fs.writeFileSync(dest, data.css);
	});
}

module.exports = obj;
