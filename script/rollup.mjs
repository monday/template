'use strict';
import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import * as tool from './tool';
import _mkdirp from 'mkdirp';
const mkdirp = promisify(_mkdirp);
const writeFile = promisify(fs.writeFile);

/**
 * jsの個別コンパイル & ファイルコピー
*/
export const compile = async (filePath) => {
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
		const {output} = await bundle.generate(outputOptions);
		//const {code, map} = await bundle.generate(outputOptions);
		// TODO: code splitに対応する
		const code = output[0].code;
		const map = output[0].map;
		await mkdirp(path.dirname(destPath));
		const codeFile = writeFile(destPath, code);
		const mapFile = writeFile(destPath.replace(/\.js/, '.map.js'), map);

		return [codeFile, mapFile];
	}catch(error){
		console.log('rollup compile error');
		console.log(error);
	}
};

/**
 * jsの全体コンパイル & ファイルコピー
*/
export const dest = async () => {
	try{
		const promises = await compile(config.js.src);
		await Promise.all(promises);
		console.log('finish all js compile.');
	}catch(error){
		console.log('rollup dest error');
		console.log(error);
	}
};