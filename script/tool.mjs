'use strict';
import {config} from './config';

/**
 * filepath先頭のsrcをdestへ変換する
*/
export const convertSrcToDest = (srcPath) => {
  const regExp = new RegExp('^' + config.src);

  return srcPath.replace(regExp, config.dest);
};

/**
 * コピーするファイルの拡張子からglobを生成する
*/
export const getCopyGlob = () => {
	let extension = [];

	for(let pattern of Object.keys(config.copy)){
		extension = extension.concat(config.copy[pattern]);
	}

	return `src/**/*.@(${extension.join('|')})`;
};