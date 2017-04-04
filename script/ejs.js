const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const config = require('./config');
const obj = {};



// EJSのコンパイル & ファイルコピー
obj.compile = (filePath) => {
	const extension = path.extname(filePath);
	const filename = path.basename(filePath, extension);
	const dirname = path.dirname(filePath).replace(/src\/ejs/, '');
	const dest = config.dest + dirname + '/' + filename + '.html';
	const image = dirname + '/';

	mkdirp(config.dest + dirname + '/', function(err){
		if(err) {
			console.log(err);
			return;
		}

		//// ejsファイルの読み込み
		//new Promise((resolve, reject) => {
		//	fs.readFile(filePath, 'utf8', (err, file) => {
		//		resolve(file);
		//	});
		//// ejsファイルのコンパイル
		//}).then((ejsFile) => {
		//	return ejs.compile(ejsFile, {
		//		filename: true
		//	});
		//// htmlとして書き込み
		//}).then((data) => {
		//	fs.writeFile(dest, data({
		//		image: image,
		//		env: process.argv[2]
		//	}));
		//}).catch((err) => {
		//	console.log(err);
		//});

		const file = fs.readFileSync(filePath, 'utf8');
		const data = ejs.compile(file, {
			filename: true
		});

		fs.writeFileSync(dest, data({
			image: image,
			port: config.port,
			env: process.argv[2]
		}));
	});
}

module.exports = obj;
