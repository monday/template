import { config } from './config';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import _bs from 'browser-sync';
import postcss from 'postcss';
//import autoprefixer from 'autoprefixer';// preset-envに含まれている
import csso from 'postcss-csso';
import atImport from 'postcss-import';
import scss from 'postcss-scss';
import postcssPresetEnv from 'postcss-preset-env';
import mkdirp from 'mkdirp';
import _glob from 'glob';
import * as tool from './tool';
const glob = promisify(_glob);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * SASSの個別コンパイル & ファイルコピー
*/
export const compile = async (filePath) => {
	const dirName = 'css';
	const destPath = tool.convertSrcToDest(filePath, dirName, '.css');
	const sourcemapPath = tool.convertSrcToDest(filePath, dirName, '.css.map');
	const destDir = path.dirname(destPath);

	try{
		// ディレクトリの作成
		await mkdirp(destDir);
        const preCssData = await readFile(filePath, { encoding: config.encoding });
		// postcss処理
		const cssData = await postcss([
            atImport,
            postcssPresetEnv({
                features: {
                    'nesting-rules': true,
                }
            }),
            //autoprefixer,
            csso
        ]).process(preCssData, {
            parser: scss,
			from: filePath,
			to: destPath,
			map: {
				inline: false,
			}
		});
		// cssファイルの書き込み
		const css = writeFile(destPath, cssData.css);
		// sourcemapファイルの書き込み
		const sourcemap = writeFile(sourcemapPath, cssData.map.toString());

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
		const files = await glob(config.css.src);
		const promises = files.map(async (filePath) => {
			return await compile(path.normalize(filePath));
		});
		await Promise.all(promises);
		console.log('finish all sass compile.');
	}catch(error){
		console.log('sass dest error');
		console.log(error);
	}
};

/**
 * srcのwatch
*/
export const watch = () => {
	const bs = _bs.get(config.name);
	const watch = bs.watch(config.css.watch);

	watch.on('ready', () => {
		watch.on('add', async (filePath) => {
			try{
				await dest(filePath);
				bs.reload();
				console.log(`finish ${filePath} add.`);
			}catch(error){
				console.log('sass add error');
				console.log(error);
			}
		}).on('change', async (filePath) => {
			try{
				await dest(filePath);
				bs.reload();
				console.log(`finish ${filePath} change.`);
			}catch(error){
				console.log('sass change error');
				console.log(error);
			}
		}).on('unlink', async (filePath) => {
			try{
				await dest(filePath);
				bs.reload();
				console.log(`finish ${filePath} delete.`);
			}catch(error){
				console.log('sass delete error');
				console.log(error);
			}
		});
	});
};
