'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const mkdirp = util.promisify(require('mkdirp'));
const glob = util.promisify(require('glob'));
const writeFile = util.promisify(fs.writeFile);
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const tool = require('./tool');
const obj = {};


/**
 * SASSの個別コンパイル & ファイルコピー
*/
obj.compile = async (filePath) => {
	try{
		const extension = path.extname(filePath);
		const filename = path.basename(filePath, extension);
		const dirname = tool.convertSrcToDest(path.dirname(filePath)).replace('scss', 'css');
		const destDirname = `${dirname}/`;
		const destPath = `${destDirname}${filename}.css`;
		const sourcemapPath = `${destDirname}${filename}.css.map`;
		const render = util.promisify(sass.render);

		// ディレクトリの作成
		const directory = await mkdirp(destDirname);
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
		})
		//// cssファイルの書き込み
		//const preCss = await writeFile(_destPath, preCssData.css);
		// sourcemapファイルの書き込み
		const preSourcemap = await writeFile(sourcemapPath, preCssData.map);
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
		console.log('error');
		console.log(error);
	}
};

/**
 * SASSの全体コンパイル & ファイルコピー
*/
obj.dest = async () => {
	try{
		const promises = await obj.compile(config.sass.src);
		const complete = await Promise.all(promises);
		console.log('finish all sass compile.');
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

module.exports = obj;
