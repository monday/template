const config = require('./config');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const obj = {};



// EJSのコンパイル & ファイルコピー
obj.compile = (filePath) => {
	const extension = path.extname(filePath);
	const filename = path.basename(filePath, extension);
	const dirname = config.dest + path.dirname(filePath).replace(config.src + '\/ejs', '') + '/';
	const dest = dirname + filename + '.html';

	mkdirp(dirname, (err) => {
		if(err) {
			console.log('ejs');
			console.log(err);
			return;
		}

		const file = fs.readFileSync(filePath, config.encoding);
		const data = ejs.compile(file, {
			filename: true
		});

		fs.writeFileSync(dest, data({
			port: config.port,// 絶対パスのために必要
			env: process.argv[2]
		}));
	});
};



obj.dest = () => {
	glob(config.ejs.src, (err, files) => {
		files.forEach((path, index) => {
			obj.compile(path);
		});
	});
};



module.exports = obj;
