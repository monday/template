const config = require('./config');
const del = require('del');
const util = require('./util');
const obj = {};



obj.exec = (filePath) => {
	const expression = filePath ? util.toDest(filePath) : config.dest;

	del.sync(expression);
}


// コマンドからの実行
if(/delete\.js/.test(process.argv[1])){
	obj.exec();
}



module.exports = obj;
