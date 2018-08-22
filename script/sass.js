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
const autoprefixer = require('autoprefixer');
const obj = {};


// SASSのコンパイル & ファイルコピー
obj.compile = async (filePath) => {
	try{
		const extension = path.extname(filePath);
		const filename = path.basename(filePath, extension);
		const dirname = `${config.dest}${path.dirname(filePath).replace(config.src, '')}/`;
		const destPath = `${dirname}${filename}.css`;
		const render = util.promisify(sass.render);

		// ディレクトリの作成
		const dir = await mkdirp(dirname);
		// sassファイルの読み込み
		const file = await readFile(filePath, config.encoding);
		// sassのコンパイル
		const data = await render({
			data: file
		});
		// vendorprefixの付与
		const css = await autoprefixer.process(data.css);
		// cssファイルの書き込み
		const write = await writeFile(destPath, css);
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

obj.dest = async () => {
	try{
		const sassPathes = await glob(config.sass.src);
		return sassPathes.map((sassPath) => {
			obj.compile(sassPath);
		});
	}catch(error){
		console.log('error');
		console.log(error);
	}
};



module.exports = obj;
