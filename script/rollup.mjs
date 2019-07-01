'use strict';
import {config} from './config';
import {promisify} from 'util';
import * as path from 'path';
import * as fs from 'fs';
import _bs from 'browser-sync';
import rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import * as tool from './tool';
import _mkdirp from 'mkdirp';
import _glob from 'glob';
const mkdirp = promisify(_mkdirp);
const glob = promisify(_glob);
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
	const destPath = tool.convertSrcToDest(filePath, 'js');
	const destDir = path.dirname(destPath);

	try{
		await mkdirp(destDir);
		const bundle = await rollup.rollup(inputOptions);
		const {output} = await bundle.generate(outputOptions);
		//const {code, map} = await bundle.generate(outputOptions);
		// TODO: code splitに対応する
		const code = output[0].code;
		const map = output[0].map;
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
		const files = await glob(config.js.src);
		const promises = files.map(async(filePath) => {
			return await compile(path.normalize(filePath));
		});
		await Promise.all(promises);
		console.log('finish all js compile.');
	}catch(error){
		console.log('rollup dest error');
		console.log(error);
	}
};

/**
 * srcのwatch
*/
export const watch = () => {
	const bs = _bs.get(config.name);
	const watch = bs.watch(config.js.watch);

	watch.on('ready', () => {
		watch.on('add', async (filePath) => {
			try{
				await dest(filePath);
				bs.reload();
				console.log(`finish ${filePath} add.`);
			}catch(error){
				console.log('js add error');
				console.log(error);
			}
		}).on('change', async (filePath) => {
			try{
				await dest(filePath);
				bs.reload();
				console.log(`finish ${filePath} change.`);
			}catch(error){
				console.log('js change error');
				console.log(error);
			}
		}).on('unlink', async (filePath) => {
			try{
				await dest(filePath);
				bs.reload();
				console.log(`finish ${filePath} delete.`);
			}catch(error){
				console.log('js delete error');
				console.log(error);
			}
		});
	});
};