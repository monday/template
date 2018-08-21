'use strict';
const config = require('./config');
const path = require('path');
const obj = {};


// srcをdestへ変換する
obj.toDest = (filePath) => {
  const regExp = new RegExp('^' + config.src);

  return filePath.replace(regExp, config.dest);
}


// destをsrcへ変換する
obj.toSrc = (filePath) => {
  const regExp = new RegExp('^' + config.dest);

  return filePath.replace(regExp, config.src);
}


// ejsのpathをdestのpathへ変換する
obj.toHTMLDestPath = (filePath) => {
  const expression = new RegExp(`${config.src}[/|¥]ejs`, 'g');
  const dirname = path.dirname(filePath).replace(expression, '');

  return `${config.dest}${dirname}/`;
}


// ejsのpathをdestのファイルネーム付きpathへ変換する
obj.toHTMLDestFullPath = (filePath) => {
  const destPath = obj.toHTMLDestPath(filePath);
  const extension = path.extname(filePath);
  const basename = path.basename(filePath, extension);

  return `${destPath}${basename}.html`;
}



module.exports = obj;
