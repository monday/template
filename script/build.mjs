import {config} from './config';
import * as path from 'path';
import browserSync from 'browser-sync';
import * as ejs from './ejs';
import * as sass from './sass';
import * as rollup from './rollup';
import * as copy from './copy';
import * as del from './delete';
import * as tool from './tool';
const bs = browserSync.create(config.name);

/**
 * エラーが発生しても落ちないようにする
*/
process.on('uncaughtException', function(err) {
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
sass.dest();
rollup.dest();
copy.dest();
ejs.dest();

/**
 * browsersyncを起動する
*/
bs.init({
	server: `${config.dest}/`,
	open: false,
	//port: config.port,
});

// ソースファイルのwatch
const watchEjs = bs.watch(config.ejs.watch);
watchEjs.on('ready', () => {
	watchEjs.on('add', async (file) => {
		try{
			if(isPartial(file)){
				await ejs.dest();
			}else{
				await ejs.compile(file);
			}
			bs.reload();
			console.log(`finish ${file} compile.`);
		}catch(error){
			console.log('ejs add error');
			console.log(error);
		}
	}).on('change', async (file) => {
		try{
			if(isPartial(file)){
				await ejs.dest();
			}else{
				await ejs.compile(file);
			}
			bs.reload();
			console.log(`finish ${file} compile.`);
		}catch(error){
			console.log('ejs change error');
			console.log(error);
		}
	}).on('unlink', async (file) => {
		try{
			if(isPartial(file)){
				await ejs.dest();
			}else{
				await del.exec(tool.convertSrcToDest(file));
			}
			bs.reload();
			console.log(`finish ${file} delete.`);
		}catch(error){
			console.log('ejs unlink error');
			console.log(error);
		}
	});
});

const watchSass = bs.watch(config.sass.watch);
watchSass.on('ready', () => {
	watchSass.on('add', (file) => {
		sass.dest(file);
		bs.reload();
	}).on('change', (file) => {
		sass.dest(file);
		bs.reload();
	}).on('unlink', (file) => {
		sass.dest(file);
		bs.reload();
	});
});

const watchJs = bs.watch(config.js.watch);
watchJs.on('ready', () => {
	watchJs.on('add', (file) => {
		rollup.dest(file);
		bs.reload();
	}).on('change', (file) => {
		rollup.dest(file);
		bs.reload();
	}).on('unlink', (file) => {
		rollup.dest(file);
		bs.reload();
	});
});

const watchCopy = bs.watch(tool.getCopyGlob());
watchCopy.on('ready', () => {
	watchCopy.on('add', async (file) => {
		try{
			await copy.file(file);
			bs.reload();
			console.log(`finish ${file} add.`);
		}catch(error){
			console.log('copy add error');
			console.log(error);
		}
	}).on('change', async (file) => {
		try{
			await copy.file(file);
			bs.reload();
			console.log(`finish ${file} change.`);
		}catch(error){
			console.log('copy change error');
			console.log(error);
		}
	}).on('unlink', (file) => {
		try{
			del.exec(tool.convertSrcToDest(file));
			console.log(`finish ${file} delete.`);
			bs.reload();
		}catch(error){
			console.log('copy unlink error');
			console.log(error);
		}
	});
});

const isPartial = (filePath) => {
	return path.dirname(filePath).split(path.sep).some((name) => name === 'partial');
};