const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const config = require('./config');
const obj = {};



// ファイルコピー
obj.files = (src, encoding) => {
	const dest = config.dest + src.replace(/^src/, '');

	new Promise((resolve, reject) => {
		mkdirp(path.dirname(dest), (err) => {
			fs.readFile(src, encoding, (err, data) => resolve(data));
		})
	})
	.then((file) => fs.writeFileSync(dest, file))
	.catch((err) => console.log(err));
}



obj.dest = () => {
	glob(config.copy.pattern(), (err, files) => {
		files.forEach((path, index) => {
			//obj.files(path, 'utf8');
			obj.files(path);
		});
	});
};



module.exports = obj;
