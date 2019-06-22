'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const glob = util.promisify(require('glob'));
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const tool = require('./tool');
const obj = {};


/**
 * jpgとpngを圧縮する
*/
obj.compress = async (input, output) => {
	try {
		return imagemin([input], output, {
			plugins: [
				imageminMozjpeg(),
				imageminPngquant({quality: '65-80'})
			]
		});
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

/**
 * 全てのjpgとpngを圧縮する
*/
obj.dest = async () => {
	try{
		const files = await glob(`src/**/*.@(${config.copy.images.join('|')})`);
		let promises = [];

		for(let file of files){
			promises.push(obj.compress(file, tool.convertSrcToDest(path.dirname(file))));
		}
		await Promise.all(promises);
		console.log('finish all images compresse.');
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

/**
 * コマンドから実行する
 * （画像全コンパイル）
*/
if(/image\.js/.test(process.argv[1])){
	obj.dest();
}

module.exports = obj;
