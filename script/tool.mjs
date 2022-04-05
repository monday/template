import {config} from './config';
import * as path from 'path';

/**
 * srcをdestへ変換
 * ディレクトリの変更
 * 拡張子の変更
*/
export const convertSrcToDest = (src, dir, ext) => {
	return [config.dest, dir, ...src.split(path.sep).slice(2)]
        .filter(Boolean)// 空白の削除
        .join(path.sep)// セパレータで結合
        .replace(/\..*$/, `${ext}`);// 拡張子の置換
};

/**
 * path先頭のsrcをdestへ変換する
*/
export const changeSrcToDest = (src) => {
	return [config.dest, ...src.split(path.sep).slice(1)].join(path.sep);
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
