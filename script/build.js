const config = require('./config');
const path = require('path');
const bs = require('browser-sync').create(config.name);
const glob = require('glob');

const ejs = require('./ejs');
const sass = require('./sass');
const copy = require('./copy');
const browserify = require('./browserify');
const del = require('./delete');



// エラーが発生しても落ちないように
process.on('uncaughtException', function(err) {
	console.log(err);
});

// destディレクトリ削除
del.exec();

// ソースファイルのコンパイル & コピー
ejs.dest();
sass.dest();
copy.dest();
browserify.dest();

// browsersync起動
bs.init({
	server: config.dest + '/',
	open: false,
	port: config.port,
});

// ソースファイルのwatch
// jsのwatchはwatchifyで行う
const watchEjs = bs.watch(config.ejs.watch);
watchEjs.on('ready', () => {
	watchEjs.on('add', (file, stats) => {
		ejs.dest();
		bs.reload();
	}).on('change', (file, stats) => {
		ejs.dest();
		bs.reload();
	}).on('unlink', (file) => {
		del.exec(file);
		ejs.dest();
		bs.reload();
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
		del.exec(file);
		sass.dest();
		bs.reload();
	});
});

const watchCopy = bs.watch(config.copy.pattern());
watchCopy.on('ready', () => {
	watchCopy.on('add', (file, stats) => {
		copy.dest(file);
		bs.reload();
	}).on('change', (file, stats) => {
		copy.dest(file);
		bs.reload();
	}).on('unlink', (file) => {
		del.exec(file);
		bs.reload();
	});
});
