'use strict';
const config = require('./config');
const path = require('path');
const obj = {};


/**
 * filepath先頭のsrcをdestへ変換する
*/
obj.convertSrcToDest = (srcPath) => {
  const regExp = new RegExp('^' + config.src);

  return srcPath.replace(regExp, config.dest);
}

/**
 * コピーするファイルの拡張子からglobを生成する
*/
obj.getCopyGlob = () => {
	let extension = [];

	for(let pattern of Object.keys(config.copy)){
		extension = extension.concat(config.copy[pattern]);
	}

	return `src/**/*.@(${extension.join('|')})`;
};

module.exports = obj;
