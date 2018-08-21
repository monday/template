'use strict';
const config = require('./config');
const path = require('path');
const obj = {};


/**
 * filepath先頭のsrcをdestへ変換する
*/
obj.convertSrcToDest = (srcPath) => {
  const regExp = new RegExp('^' + config.src);

  return srcPath.replace(regExp, config.dest);
}

/**
 * ejsのpathをdestのdirectoryへ変換する
*/
obj.convertEJSDirnameToDestDirname = (ejsPath) => {
  const expression = new RegExp(`${config.src}[/|¥]ejs`, 'g');
  const dirname = path.dirname(ejsPath).replace(expression, '');

  return `${config.dest}${dirname}/`;
}

/**
 * ejsのpathをdestのpathへ変換する
*/
obj.convertEJSPathToDestPath = (ejsPath) => {
  const destDirname = obj.convertEJSDirnameToDestDirname(ejsPath);
  const extension = path.extname(ejsPath);
  const basename = path.basename(ejsPath, extension);

  return `${destDirname}${basename}.html`;
}

module.exports = obj;
