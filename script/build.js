'use strict';
const config = require('./config');
const path = require('path');
const bs = require('browser-sync').create(config.name);
const ejs = require('./ejs');
const sass = require('./sass');
const rollup = require('./rollup');
const copy = require('./copy');
const del = require('./delete');
const tool = require('./tool');


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
	watchEjs.on('add', async (file, stats) => {
		try{
			if(isPartial(file)){
				ejs.dest();
			}else{
				const complete = await ejs.compile(file);
				console.log(`finish ${file} compile.`);
			}
			bs.reload();
		}catch(error){
			console.log('error');
			console.log(error);
		}
	}).on('change', async (file, stats) => {
		try{
			if(isPartial(file)){
				ejs.dest();
			}else{
				const complete = await ejs.compile(file);
				console.log(`finish ${file} compile.`);
			}
			bs.reload();
		}catch(error){
			console.log('error');
			console.log(error);
		}
	}).on('unlink', async (file) => {
		try{
			if(isPartial(file)){
				ejs.dest();
			}else{
				del.exec(tool.convertSrcToDest(file));
				console.log(`finish ${file} delete.`);
			}
			bs.reload();
		}catch(error){
			console.log('error');
			console.log(error);
		}
	});
});

const watchSass = bs.watch(config.sass.watch);
watchSass.on('ready', () => {
	watchSass.on('add', (file, stats) => {
		sass.dest();
		bs.reload();
	}).on('change', (file, stats) => {
		sass.dest();
		bs.reload();
	}).on('unlink', (file) => {
		sass.dest();
		bs.reload();
	});
});

const watchCopy = bs.watch(tool.getCopyGlob());
watchCopy.on('ready', () => {
	watchCopy.on('add', async (file, stats) => {
		try{
			const complete = await copy.file(file);
			console.log(`finish ${file} add.`);
			bs.reload();
		}catch(error){
			console.log('error');
			console.log(error);
		}
	}).on('change', async (file, stats) => {
		try{
			const complete = await copy.file(file);
			console.log(`finish ${file} change.`);
			bs.reload();
		}catch(error){
			console.log('error');
			console.log(error);
		}
	}).on('unlink', (file) => {
		try{
			del.exec(tool.convertSrcToDest(file));
			console.log(`finish ${file} delete.`);
			bs.reload();
		}catch(error){
			console.log('error');
			console.log(error);
		}
	});
});

const isPartial = (filePath) => {
	return /\/partial\//.test(filePath);
}
