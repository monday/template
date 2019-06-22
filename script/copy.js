'use strict';
//const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const mkdirp = util.promisify(require('mkdirp'));
const glob = util.promisify(require('glob'));
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
		await mkdirp(destDirname);
		// ファイルの読み込み
		const fileData = await readFile(filePath, encoding);
		// ファイルの書き込み
		return writeFile(destPath, fileData);
	}catch(error){
		console.log('copy file error');
		console.log(error);
	}
};

/**
 * ファイルを全体コピーする
*/
obj.dest = async () => {
	try{
		const expression = tool.getCopyGlob();
		const files = await glob(expression);
		let promises = [];

		for(let file of files){
			promises.push(obj.file(file));
		}
		await Promise.all(promises);
		console.log('finish all file copy.');
	}catch(error){
		console.log('copy dest error');
		console.log(error);
	}
};

module.exports = obj;
