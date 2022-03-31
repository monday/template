import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import _bs from 'browser-sync';
import mkdirp from 'mkdirp';
import _glob from 'glob';
import * as tool from './tool';
import * as del from './delete';
const glob = promisify(_glob);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * ファイルを個別コピーする
*/
export const file = async (filePath, encoding) => {
	const destPath = tool.convertSrcToDest(filePath, 'images');
	const destDir = path.dirname(destPath);

	try{
		// ディレクトリの作成
		await mkdirp(destDir);
		// ファイルの読み込み
		const fileData = await readFile(filePath, encoding);
		// ファイルの書き込み
		return writeFile(destPath, fileData);
	}catch(error){
		console.log('copy file error');
		console.log(error);
	}
};

/**
 * ファイルを全体コピーする
*/
export const dest = async () => {
	try{
		const expression = tool.getCopyGlob();
		const files = await glob(expression);
		const promises = files.map(async (filePath) => {
			return await file(path.normalize(filePath));
		});
		await Promise.all(promises);
		console.log('finish all file copy.');
	}catch(error){
		console.log('copy dest error');
		console.log(error);
	}
};

/**
 * srcのwatch
*/
export const watch = () => {
	const bs = _bs.get(config.name);
	const watch = bs.watch(tool.getCopyGlob());

	watch.on('ready', () => {
		watch.on('add', async (filePath) => {
			try{
				await file(filePath);
				bs.reload();
				console.log(`finish ${filePath} add.`);
			}catch(error){
				console.log('copy add error');
				console.log(error);
			}
		}).on('change', async (filePath) => {
			try{
				await file(filePath);
				bs.reload();
				console.log(`finish ${filePath} change.`);
			}catch(error){
				console.log('copy change error');
				console.log(error);
			}
		}).on('unlink', (filePath) => {
			try{
				del.exec(tool.convertSrcToDest(filePath, 'images'));
				console.log(`finish ${filePath} delete.`);
				bs.reload();
			}catch(error){
				console.log('copy delete error');
				console.log(error);
			}
		});
	});
};
