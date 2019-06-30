import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import ejs from 'ejs';
import broserSync from 'browser-sync';
import _mkdirp from 'mkdirp';
import _glob from 'glob';
import * as tool from './tool';
const mkdirp = promisify(_mkdirp);
const glob = promisify(_glob);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * EJSの個別コンパイル & ファイルコピー
*/
export const compile = async (filePath) => {
	const bs = broserSync.get(config.name);
	const destPath = tool.convertSrcToDest(filePath, '', '.html');
	const destDir = path.dirname(destPath);

	try{
		// EJSのPathからDestディレクトリを作成
		await mkdirp(destDir);
		// EJSファイルの読み込み
		const ejsData = await readFile(filePath, config.encoding);
		// EJSファイルのコンパイル
		const htmlData = await ejs.compile(ejsData, {
			filename: filePath
		});

		// HTMLファイルの書き込み
		return writeFile(destPath, htmlData({
			// browsersyncの非公開メソッド
			// immutable.jsが使用されているのでtoJSで元に戻す
			// 絶対パスのために必要
			// ejsテンプレートに
			// {
			// 	local: 'http://localhost:(port)',
			//	external: 'http://(IP):(port)'
			// }
			// が渡る
			urls: bs.instance.utils.getUrlOptions(bs.instance.options).toJS(),
			env: process.argv[2],
		}));
	}catch(error){
		console.log('ejs compile error');
		console.log(error);
	}
};

/**
 * EJSの全体コンパイル & ファイルコピー
*/
export const dest = async () => {
	try{
		const files = await glob(config.ejs.src);
		let promises = [];
		for(let file of files){
			promises.push(compile(path.normalize(file)));
		}
		await Promise.all(promises);
		console.log('finish all ejs compile.');
	}catch(error){
		console.log('ejs dest error');
		console.log(error);
	}
};