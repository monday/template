const del = require('del');
const config = require('./config');
const obj = {};

obj.dest = () => del.sync(config.dest);

// コマンドからの利用
if(process.argv[2]){
	obj.dest();
}

// destディレクトリ削除
module.exports = obj;
