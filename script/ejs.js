'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mkdirp = util.promisify(require('mkdirp'));
const glob = util.promisify(require('glob'));
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const bs = require('browser-sync').get(config.name);
const obj = {};


/**
 * EJSの個別コンパイル & ファイルコピー
*/
obj.compile = async (filePath) => {
	try{
		const extension = path.extname(filePath);
		const filename = path.basename(filePath, extension);
		const expression = new RegExp(`${config.src}[/|¥]ejs`, 'g');
		const dirname = path.dirname(filePath).replace(expression, '');
		const destDirname = `${config.dest}${dirname}/`;
		const destPath = `${destDirname}${filename}.html`;

		// EJSのPathからDestディレクトリを作成
		await mkdirp(destDirname);
		// EJSファイルの読み込み
		const ejsData = await readFile(filePath, config.encoding);
		// EJSファイルのコンパイル
		const htmlData = await ejs.compile(ejsData, {
			filename: filePath
		});
		// HTMLファイルの書き込み
		return writeFile(destPath, htmlData({
			// browsersyncの非公開メソッド
			// immutable.jsが使用されているのでtoJSで元に戻す
			// 絶対パスのために必要
			// ejsテンプレートに
			// {
			// 	local: 'http://localhost:\d\d\d\d',
			//	external: 'http://(IP):\d\d\d\d'
			// }
			// が渡る
			urls: bs.instance.utils.getUrlOptions(bs.instance.options).toJS(),
			env: process.argv[2],
		}));
	}catch(error){
		console.log('ejs compile error');
		console.log(error);
	}
};

/**
 * EJSの全体コンパイル & ファイルコピー
*/
obj.dest = async () => {
	try{
		const files = await glob(config.ejs.src);
		let promises = [];
		for(let file of files){
			promises.push(obj.compile(file));
		}
		await Promise.all(promises);
		console.log('finish all ejs compile.');
	}catch(error){
		console.log('ejs dest error');
		console.log(error);
	}
};

module.exports = obj;
