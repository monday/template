const config = require('./config');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const tool = require('./tool');
const obj = {};



// ファイルコピー
obj.files = (src, encoding) => {
	const dest = tool.convertSrcToDest(src);

	new Promise((resolve, reject) => {
		mkdirp(path.dirname(dest), (err) => {
			fs.readFile(src, encoding, (err, data) => resolve(data));
		})
	})
	.then((file) => fs.writeFileSync(dest, file))
	.catch((err) => console.log(err));
}



obj.dest = (filePath) => {
	const expression = filePath ? filePath : config.copy.pattern();

	glob(expression, (err, files) => {
		files.forEach((path, index) => {
			//obj.files(path, 'utf8');
			obj.files(path);
		});
	});
};



module.exports = obj;
