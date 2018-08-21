const config = require('./config');
const del = require('del');
const tool = require('./tool');
const obj = {};



obj.exec = (filePath) => {
	const expression = filePath ? tool.toDest(filePath) : config.dest;

	del.sync(expression);
}


// コマンドからの実行
if(/delete\.js/.test(process.argv[1])){
	obj.exec();
}



module.exports = obj;
