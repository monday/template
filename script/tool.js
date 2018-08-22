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

module.exports = obj;
