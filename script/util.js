const config = require('./config');
const obj = {};



obj.toDest = (filePath) => {
	const regExp = new RegExp('^' + config.src);

	return filePath.replace(regExp, config.dest);
}


obj.toSrc = (filePath) => {
	const regExp = new RegExp('^' + config.dest);

	return filePath.replace(regExp, config.src);
}



module.exports = obj;
