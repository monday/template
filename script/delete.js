'use strict';
const config = require('./config');
const del = require('del');
const tool = require('./tool');
const obj = {};


/**
 * filePathのファイルを削除する
 * 引数なしの場合は全削除する
*/
obj.exec = (filePath) => {
	const expression = filePath ? tool.convertSrcToDest(filePath) : config.dest;

	del.sync(expression);
}

/**
 * コマンドから実行する
*/
if(/delete\.js/.test(process.argv[1])){
	obj.exec();
}

module.exports = obj;
