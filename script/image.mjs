import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import _glob from 'glob';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import * as tool from './tool';
const glob = promisify(_glob);

/**
 * jpgとpngを圧縮する
*/
const compress = async (input, output) => {
	try {
		return imagemin([input], output, {
			plugins: [
				imageminMozjpeg(),
				imageminPngquant({quality: '65-80'})
			]
		});
	}catch(error){
		console.log('image compress error');
		console.log(error);
	}
};

/**
 * 全てのjpgとpngを圧縮する
*/
const dest = async () => {
	try{
		const files = await glob(`src/**/*.@(${config.copy.images.join('|')})`);
		let promises = [];

		for(let file of files){
			promises.push(compress(file, tool.convertSrcToDest(path.dirname(file))));
		}
		await Promise.all(promises);
		console.log('finish all images compresse.');
	}catch(error){
		console.log('image dest error');
		console.log(error);
	}
};

/**
 * コマンドから実行する
 * （画像全コンパイル）
*/
if(/image\.mjs/.test(process.argv[1])){
	dest();
}