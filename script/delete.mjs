import {config} from './config';
import del from 'del';

/**
 * filePathのファイルを削除する
 * 引数なしの場合は全削除する
*/
export const exec = (filePath) => {
	const expression = filePath ? filePath : config.dest;

	del.sync(expression);
};

/**
 * コマンドから実行する
*/
if(/delete\.mjs/.test(process.argv[1])){
    const arg = process.argv[2] ? process.argv[2] : '';
	exec(arg);
}
