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
const tool = require('./tool');
const obj = {};


// EJSのコンパイル & ファイルコピー
obj.compile = async (filePath) => {
	try{
		const destPath = tool.convertEJSDirnameToDestDirname(filePath);
		const dest = tool.convertEJSPathToDestPath(filePath);

		// async / awaitバージョン
		const dir = await (() => {
			mkdirp(destPath);
		})();
		const ejsFile = await (() => {
			return readFile(filePath, config.encoding);
		})();
		const htmlFile = await (() => {
			return ejs.compile(ejsFile, {
				filename: filePath
			});
		})();
		const _writeFile = await (() => {
			return writeFile(dest, htmlFile({
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
		})();
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

obj.dest = async () => {
	try{
		const files = await glob(config.ejs.src);
		return files.map((file) => {
			return obj.compile(file);
		});
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

module.exports = obj;
