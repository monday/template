'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const mkdirp = util.promisify(require('mkdirp'));
const glob = util.promisify(require('glob'));
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const bs = require('browser-sync').get(config.name);
const tool = require('./tool');
const obj = {};


/**
 * jsの個別コンパイル & ファイルコピー
*/
obj.compile = async (filePath) => {
	const inputOptions = {
		input: filePath,
	};
	const outputOptions = {
		output: {
			format: 'iife',
			name: 'myBundle',
		},
	};
	const destPath = tool.convertSrcToDest(filePath);

	try{
		const bundle = await rollup.rollup(inputOptions);
		const {code, map} = await bundle.generate(outputOptions);
		const directory = await mkdirp(path.dirname(destPath));
		const codeFile = writeFile(destPath, code);
		const mapFile = writeFile(destPath.replace(/\.js/, '.map.js'), map);

		return [codeFile, mapFile];
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

/**
 * jsの全体コンパイル & ファイルコピー
*/
obj.dest = async () => {
	try{
		const promises = await obj.compile(config.js.src);
		const complete = await Promise.all(promises);
		console.log('finish all js compile.');
	}catch(error){
		console.log('error');
		console.log(error);
	}
};

module.exports = obj;
