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


/**
 * EJSの個別コンパイル & ファイルコピー
*/
obj.compile = async (ejsPath) => {
	try{
		const dir = await obj.createDestDirectory(ejsPath);
		const ejsFile = await obj.readEJSFile(ejsPath);
		const compileEJSFile = await obj.compileEJSFile(ejsPath, ejsFile);
		const writeFile = await obj.writeHTMLFile(ejsPath, compileEJSFile);
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

/**
 * EJSのPathからDestディレクトリを作成
*/
obj.createDestDirectory = (ejsPath) => {
	const destDirname = tool.convertEJSDirnameToDestDirname(ejsPath);

	return mkdirp(destDirname);
};

/**
 * EJSファイルの読み込み
*/
obj.readEJSFile = (ejsPath) => {
	return readFile(ejsPath, config.encoding);
};

/**
 * EJSファイルのコンパイル
*/
obj.compileEJSFile = (ejsPath, ejsFile) => {
	return ejs.compile(ejsFile, {
		filename: ejsPath
	});
};

/**
 * HTMLファイルの書き込み
*/
obj.writeHTMLFile = (ejsPath, compileEJSFile) => {
	const destPath = tool.convertEJSPathToDestPath(ejsPath);

	return writeFile(destPath, compileEJSFile({
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
};

/**
 * EJSの全体コンパイル & ファイルコピー
*/
obj.dest = async () => {
	try{
		const ejsPathes = await glob(config.ejs.src);
		return ejsPathes.map((ejsPath) => {
			return obj.compile(ejsPath);
		});
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

module.exports = obj;
