const fs = require('fs');
const path = require('path');
const result = [];
const obj = {};


// ディレクトリ再帰し引数で処理する
obj.process = (target, process) => {
	fs.readdir(target, function(err, files){
		if(err) {
			console.log(err);
			return;
		}

		files.forEach(function(file, index){
			var filePath = path.join(target, file);

			// ディレクトリの場合は再帰する
			if(fs.statSync(filePath).isDirectory()){
				obj.process(filePath, process);
			// ファイルの場合は処理する
			}else{
				process(filePath);
			}
		});
	});
}



// ディレクトリ再帰処理して全ファイルのパスを返す
obj.getFilePath = (target) => {
	const files = fs.readdirSync(target);

	files.forEach(function(file, index){
		var filePath = path.join(target, file);

		// ディレクトリの場合は再帰する
		if(fs.statSync(filePath).isDirectory()){
			obj.getFilePath(filePath);
		// ファイルの場合は処理する
		}else{
			result.push(filePath);
		}
	});

	return result;
}



module.exports = obj;
