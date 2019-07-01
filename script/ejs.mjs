import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import ejs from 'ejs';
import _bs from 'browser-sync';
import * as del from './delete';
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
	const bs = _bs.get(config.name);
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
		const promises = files.map(async (filePath) => {
			return await compile(path.normalize(filePath));
		});
		await Promise.all(promises);
		console.log('finish all ejs compile.');
	}catch(error){
		console.log('ejs dest error');
		console.log(error);
	}
};

/**
 * srcのwatch
*/
export const watch = () => {
	const bs = _bs.get(config.name);
	const watch = bs.watch(config.ejs.watch);

	watch.on('ready', () => {
		watch.on('add', async (filePath) => {
			try{
				if(tool.isPartial(filePath)){
					await dest();
				}else{
					await compile(filePath);
				}
				bs.reload();
				console.log(`finish ${filePath} add.`);
			}catch(error){
				console.log('ejs add error');
				console.log(error);
			}
		}).on('change', async (filePath) => {
			try{
				if(tool.isPartial(filePath)){
					await dest();
				}else{
					await compile(filePath);
				}
				bs.reload();
				console.log(`finish ${filePath} change.`);
			}catch(error){
				console.log('ejs change error');
				console.log(error);
			}
		}).on('unlink', async (filePath) => {
			try{
				if(tool.isPartial(filePath)){
					await dest();
				}else{
					await del.exec(tool.convertSrcToDest(filePath, '', '.html'));
				}
				bs.reload();
				console.log(`finish ${filePath} delete.`);
			}catch(error){
				console.log('ejs delete error');
				console.log(error);
			}
		});
	});
};