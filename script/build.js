const config = require('./config');
const path = require('path');
const bs = require('browser-sync').create(config.name);
const glob = require('glob');

const ejs = require('./ejs');
const sass = require('./sass');
const copy = require('./copy');
const browserify = require('./browserify');
const del = require('./delete');



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
bs.watch(config.ejs.watch).on('change', function(){
	ejs.dest();
	bs.reload();
});
bs.watch(config.sass.watch).on('change', function(){
	sass.dest();
	bs.reload();
});
bs.watch(config.copy.pattern(), (e, file) => {
	// ファイル削除
	if(e === 'unlink'){
		del.exec(file);
	// add or changeでファイルコピー
	}else{
		copy.dest(file);
	}

	bs.reload();
});
