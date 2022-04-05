import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import _glob from 'glob';
import mkdirp from 'mkdirp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import * as tool from './tool';
const glob = promisify(_glob);

/**
 * jpg / png / svgを圧縮する
*/
const compress = async (input, dest) => {
	try {
		return imagemin([input], {
            destination: dest,
			plugins: [
				imageminMozjpeg(),
				imageminPngquant({
                    quality: [0.6, 0.8]
                }),
				imageminSvgo(),
			]
		});
	}catch(error){
		console.log('image compress error');
		console.log(error);
	}
};

/**
 * 全てのjpg / png / svgを圧縮する
*/
const dest = async () => {
	try{
		const files = await glob(`${config.src}/images/original/**/*.@(jp?(e)g|png|svg)`);
		const promises = files.map(async (filePath) => {
            const arr = path.dirname(filePath).split(path.sep);
            arr.splice(2, 1);
            const dest = arr.join(path.sep);
            await mkdirp(dest);
			return compress(filePath, dest);
		});
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
