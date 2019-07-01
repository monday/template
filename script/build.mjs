import {config} from './config';
import _bs from 'browser-sync';
import * as ejs from './ejs';
import * as sass from './sass';
import * as rollup from './rollup';
import * as copy from './copy';
import * as del from './delete';
const bs = _bs.create(config.name);

/**
 * エラーが発生しても落ちないようにする
*/
process.on('uncaughtException', (err) => {
	console.log('uncaughtException');
	console.log(err);
});

/**
 * destディレクトリを削除する
*/
del.exec();

/**
 * ソースファイルをコンパイルしてコピーする
*/
copy.dest();
sass.dest();
rollup.dest();
ejs.dest();

/**
 * browsersyncを起動する
*/
bs.init({
	server: `${config.dest}/`,
	open: false,
	//port: config.port,
});

/**
 * ファイルの変更を監視する
*/
copy.watch();
sass.watch();
rollup.watch();
ejs.watch();