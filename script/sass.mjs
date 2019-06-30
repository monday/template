'use strict';
import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import * as tool from './tool';
import _mkdirp from 'mkdirp';
const mkdirp = promisify(_mkdirp);
const writeFile = promisify(fs.writeFile);

/**
 * SASSの個別コンパイル & ファイルコピー
*/
export const compile = async (filePath) => {
	const dirName = 'css';
	const destPath = tool.convertSrcToDest(filePath, dirName, '.css');
	const sourcemapPath = tool.convertSrcToDest(filePath, dirName, '.map.css');
	const destDir = path.dirname(destPath);
	////const render = util.promisify(sass.render);

	try{
		// ディレクトリの作成
		await mkdirp(destDir);
		// sassのコンパイル
		//const preCssData = await render({
		//	sourceMap: true,
		//	file: filePath,
		//	outFile: destPath,
		//});
		const preCssData = sass.renderSync({
			file: filePath,
			sourceMap: true,
			outFile: destPath,
		});
		//// cssファイルの書き込み
		//const preCss = await writeFile(_destPath, preCssData.css);
		// sourcemapファイルの書き込み
		await writeFile(sourcemapPath, preCssData.map);
		// postcss処理
		const cssData = await postcss([autoprefixer, csso]).process(preCssData.css, {
			from: destPath,
			to: destPath,
			map: {
				inline: false,
				//prev: false,
			}
		});
		// cssファイルの書き込み
		const css = await writeFile(destPath, cssData.css);
		// sourcemapファイルの書き込み
		const sourcemap = await writeFile(sourcemapPath, cssData.map);

		return [css, sourcemap];
	}catch(error){
		console.log('sass compile error');
		console.log(error);
	}
};

/**
 * SASSの全体コンパイル & ファイルコピー
*/
export const dest = async () => {
	try{
		const promises = await compile(config.sass.src);
		await Promise.all(promises);
		console.log('finish all sass compile.');
	}catch(error){
		console.log('sass dest error');
		console.log(error);
	}
};