'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const mkdirp = util.promisify(require('mkdirp'));
const glob = util.promisify(require('glob'));
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const obj = {};


/**
 * SASSの個別コンパイル & ファイルコピー
*/
obj.compile = async (filePath) => {
	try{
		const extension = path.extname(filePath);
		const filename = path.basename(filePath, extension);
		const dirname = path.dirname(filePath).replace(config.src, '').replace('scss', 'css');
		const destDirname = `${config.dest}${dirname}/`;
		const destPath = `${destDirname}${filename}.css`;
		const sourcemapPath = `${destDirname}${filename}.css.map`;
		const render = util.promisify(sass.render);

		// ディレクトリの作成
		const directory = await mkdirp(destDirname);
		// sassのコンパイル
		const preCssData = await render({
			sourceMap: true,
			file: filePath,
			outFile: 'dest/css/style.css',
			//outputStyle: 'compressed',
		});
		// cssファイルの書き込み
		const preCss = await writeFile(destPath, preCssData.css);
		// sourcemapファイルの書き込み
		const preSourcemap = await writeFile(sourcemapPath, preCssData.map);
		// postcss処理
		const cssData = await postcss([autoprefixer, csso]).process(preCssData.css, {
			from: destPath,
			to: destPath,
			map: {
				inline: false
			}
		});
		// cssファイルの書き込み
		const css = writeFile(destPath, cssData.css);
		// sourcemapファイルの書き込み
		const sourcemap = writeFile(sourcemapPath, cssData.map);
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
		obj.compile(config.sass.src);
	}catch(error){
		console.log('error');
		console.log(error);
	}
};



module.exports = obj;
