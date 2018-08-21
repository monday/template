'use strict';
const config = require('./config');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const bs = require('browser-sync').get(config.name);
const tool = require('util');
const util = require('./util');
const obj = {};



// EJSのコンパイル & ファイルコピー
obj.compile = async (filePath) => {
	try{
		const destPath = util.toHTMLDestPath(filePath);
		const dest = util.toHTMLDestFullPath(filePath);

		// async / awaitバージョン
		const mkdir = tool.promisify(mkdirp);
		const readFileAsync = tool.promisify(fs.readFile);
		const writeFileAsync = tool.promisify(fs.writeFile);
		const dir = await (() => {
			mkdir(destPath);
		})();
		const ejsFile = await (() => {
			return readFileAsync(filePath, config.encoding);
		})();
		const htmlFile = await (() => {
			return ejs.compile(ejsFile, {
				filename: filePath
			});
		})();
		const writeFile = await (() => {
			return writeFileAsync(dest, htmlFile({
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

	// Promiseバージョン
	//return new Promise((resolve, reject) => {
	//	mkdirp(destPath, (err) => {
	//		if(err) {
	//			console.log('ejs');
	//			console.log(err);
	//			reject();
	//			return;
	//		}

	//		const file = fs.readFileSync(filePath, config.encoding);
	//		const data = ejs.compile(file, {
	//			filename: filePath
	//		});

	//		fs.writeFile(dest, data({
	//			// browsersyncの非公開メソッド
	//			// immutable.jsが使用されているのでtoJSで元に戻す
	//			// 絶対パスのために必要
	//			// ejsテンプレートに
	//			// {
	//			// 	local: 'http://localhost:\d\d\d\d',
	//			//	external: 'http://(IP):\d\d\d\d'
	//			// }
	//			// が渡る
	//			urls: bs.instance.utils.getUrlOptions(bs.instance.options).toJS(),
	//			env: process.argv[2],
	//		}), (err) => {
	//			if(err){
	//				reject();
	//			}

	//			resolve();
	//		})
	//	});
	//});
};



obj.dest = () => {
	var promises = [];

	return new Promise((resolve, reject) => {
		glob(config.ejs.src, (err, files) => {
			files.forEach((filePath, index) => {
				promises.push(obj.compile(filePath));
			});
			resolve(promises);
		});
	})
};



module.exports = obj;
