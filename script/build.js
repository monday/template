const path = require('path');
const bs = require('browser-sync');
const glob = require('glob');

const config = require('./config');
const del = require('./delete');
const ejs = require('./ejs');
const sass = require('./sass');
const copy = require('./copy');



// destディレクトリ削除
del.dest();

// ソースファイルのコンパイル & コピー
ejs.dest();
sass.dest();
copy.dest();

// browsersync起動
bs.init({
	server: config.dest + '/',
	open: false,
	port: config.port,
});

// ソースファイルのwatch
bs.watch('src/**/*.ejs').on('change', function(){
	ejs.dest();
	bs.reload();
});
bs.watch('src/**/*.scss').on('change', function(){
	sass.dest();
	bs.reload();
});
bs.watch(config.copy.pattern()).on('change', function(){
	copy.dest();
	bs.reload();
});
