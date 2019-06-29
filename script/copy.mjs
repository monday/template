import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import _mkdirp from 'mkdirp';
import _glob from 'glob';
import * as tool from './tool';
const mkdirp = promisify(_mkdirp);
const glob = promisify(_glob);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * ファイルを個別コピーする
*/
export const file = async (filePath, encoding) => {
	try{
		const destPath = tool.convertSrcToDest(filePath);
		const destDirname = path.dirname(destPath);

		// ディレクトリの作成
		await mkdirp(destDirname);
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
		let promises = [];

		for(let _file of files){
			promises.push(file(_file));
		}
		await Promise.all(promises);
		console.log('finish all file copy.');
	}catch(error){
		console.log('copy dest error');
		console.log(error);
	}
};