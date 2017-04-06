const path = require('path');
const bs = require('browser-sync');

const config = require('./config');
const del = require('./delete');
const recursive = require('./recursive');
const ejs = require('./ejs');
const sass = require('./sass');
const copy = require('./copy');



// 拡張子によって処理を振り分ける
function sortInExtension (filePath){
	const extension = path.extname(filePath);
	const regExp = new RegExp(config.exclude);

	if(regExp.test(filePath)){
		return;
	}
	if(extension === '.ejs'){
		ejs.compile(filePath);
	}else if(extension === '.html'){
		copy.file(filePath);
	}else if(extension === '.js'){
		copy.file(filePath);
	}else if(extension === '.css'){
		copy.file(filePath);
	}else if(extension === '.scss'){
		sass.compile(filePath);
	}else if(/\.(png|jpg|jpeg|gif)/.test(extension)){
		copy.binary(filePath);
	//}else if(/\.(eot|woff|woff2|ttf|otf)/.test(extension)){
	//	copy.binary(filePath);
	}else{
		return;
	}
}



// destディレクトリ削除
del.dest();

// コンパイル
recursive.process('src/', sortInExtension);

// browsersync起動
bs.init({
	server: config.dest + '/',
	port: config.port,
});

// ソースファイルのwatch
bs.watch('src/**').on('change', function(){
	recursive.process('src/', sortInExtension);
	bs.reload();
});
