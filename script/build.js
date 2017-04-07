const config = require('./config');
const path = require('path');
const bs = require('browser-sync').create(config.name);
const glob = require('glob');

const del = require('./delete');
const ejs = require('./ejs');
const sass = require('./sass');
const copy = require('./copy');
const browserify = require('./browserify');



// destディレクトリ削除
del.dest();

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
// jsのwatchはwatchifyで
bs.watch(config.ejs.watch).on('change', function(){
	ejs.dest();
	bs.reload();
});
bs.watch(config.sass.watch).on('change', function(){
	sass.dest();
	bs.reload();
});
bs.watch(config.copy.pattern()).on('change', function(){
	copy.dest();
	bs.reload();
});
