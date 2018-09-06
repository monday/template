'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const mkdirp = util.promisify(require('mkdirp'));
const glob = require('glob');
//const glob = util.promisify(require('glob'));
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const tool = require('./tool');
const obj = {};


/**
 * ファイルを個別コピーする
*/
obj.file = async (filePath, encoding) => {
	try{
		const destPath = tool.convertSrcToDest(filePath);
		const destDirname = path.dirname(destPath);

		// ディレクトリの作成
		const directory = await mkdirp(destDirname);
		// ファイルの読み込み
		const fileData = await readFile(filePath, encoding);
		// ファイルの書き込み
		const file = writeFile(destPath, fileData);
	}catch(error){
		console.log('error');
		console.log(error);
	}
}

/**
 * ファイルを全体コピーする
*/
obj.dest = () => {
	const expression = tool.getCopyGlob();

	glob(expression, (err, files) => {
		files.forEach((path, index) => {
			//obj.files(path, 'utf8');
			obj.file(path);
		});
	});
};

module.exports = obj;
