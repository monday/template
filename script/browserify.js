const config = require('./config');
const path = require('path');
const fs = require('fs');
const bs = require('browser-sync').get(config.name);
const Browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const mkdirp = require('mkdirp');
const glob = require('glob');
const obj = {};


obj.compile = (filePath) => {
	const filename = path.basename(filePath);

	// TODO: pathがarrayかどうかをチェックする
	const browserify = new Browserify({
		entries: [filePath],	// エントリポイント
		cache: {},				// 差分ビルド
		packageCache: {},		// 差分ビルド
		debug: true,			// ソースマップ出力
		plugin: [watchify],		// 差分だけ更新
		transform: [babelify]	// bebel
	});

	browserify.on('update', () => {
		bundle();
		bs.reload();
	});

	mkdirp(config.browserify.dest, (err) => {
		if(err) {
			console.log('browserify');
			console.log(err);
			return;
		}

		bundle();
	});

	function bundle(){
		browserify.bundle((err, buffer) => {
			fs.writeFileSync(config.browserify.dest + filename, buffer);
		});
	}

	//function bundle(){
	//	mkdirp(config.browserify.dest, (err) => {
	//		if(err) {
	//			console.log('browserify');
	//			console.log(err);
	//			return;
	//		}

	//		browserify.bundle((err, buffer) => {
	//			fs.writeFileSync(config.browserify.dest + filename, buffer);
	//		});
	//	});
	//}
};



obj.dest = () => {
	glob(config.browserify.src, (err, files) => {
		files.forEach((path, index) => {
			obj.compile(path);
		});
	});
};



module.exports = obj;
