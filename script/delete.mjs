import {config} from './config';
import del from 'del';
import * as tool from './tool';

/**
 * filePathのファイルを削除する
 * 引数なしの場合は全削除する
*/
export const exec = (filePath) => {
	const expression = filePath ? tool.convertSrcToDest(filePath) : config.dest;

	del.sync(expression);
};

/**
 * コマンドから実行する
*/
if(/delete\.mjs/.test(process.argv[1])){
	exec();
}