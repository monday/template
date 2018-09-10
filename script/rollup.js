'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const mkdirp = util.promisify(require('mkdirp'));
const writeFile = util.promisify(fs.writeFile);
const tool = require('./tool');
const obj = {};


/**
 * jsの個別コンパイル & ファイルコピー
*/
obj.compile = async (filePath) => {
	const inputOptions = {
		input: filePath,
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**' // only transpile our source code
			})
		],
	};
	const outputOptions = {
		output: {
			format: 'iife',
			name: 'myBundle',
			sourcemap: true,
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
