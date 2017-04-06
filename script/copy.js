const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const config = require('./config');
const obj = {};



// テキストファイルコピー
obj.file = (filePath) => {
	const src = filePath;
	const dest = config.dest + src.replace(/^src/, '');

	mkdir(src, dest, false)
		.then((file) => fs.writeFileSync(dest, file))
		.catch((err) => console.log(err));
}



// バイナリファイルコピー
obj.binary = (filePath) => {
	const src = filePath;
	const dest = config.dest + src.replace(/^src/, '');

	mkdir(src, dest, true)
		.then((file) => fs.writeFileSync(dest, file))
		.catch((err) => console.log(err));
}


// TODO: 文字コード指定は外だししてcopyメソッドを作る
obj.dest = () => {
	glob('src/**/*.@(html|css|png|jpg|jpeg|gif|eot|woff|woff2|ttf|otf)', (err, files) => {
		files.forEach((path, index) => {
			obj.binary(path);
		});
	});
};



const mkdir = (src, dest, isBinary) => {
	return new Promise((resolve, reject) => {
		mkdirp(path.dirname(dest), (err) => {
			const option = isBinary ? {} : 'utf8';
			fs.readFile(src, option, (err, data) => resolve(data));
		});
	})
}

module.exports = obj;
