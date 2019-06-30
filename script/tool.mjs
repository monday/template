import {config} from './config';
import * as path from 'path';

/**
 * filepath先頭のsrcをdestへ変換する
*/
export const convertSrcToDest = (filePath, dirName, extension) => {
	const parse = path.parse(filePath);
	let dir = path.join(config.dest, dirName);
	parse.dir.split(path.sep).slice(2).forEach((name) => dir = path.join(dir, name));
	const base = extension ? `${parse.name}${extension}` : parse.base;

	return path.join(dir, base);
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

export const isPartial = (filePath) => {
	return path.dirname(filePath).split(path.sep).some((name) => name === 'partial');
};