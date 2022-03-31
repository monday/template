'use strict';
import { config } from './config';
import { promisify } from 'util';
import * as path from 'path';
import _bs from 'browser-sync';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import * as tool from './tool';
import _glob from 'glob';
const glob = promisify(_glob);

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
        babelHelpers: 'bundled',
        exclude: 'node_modules/**', // only transpile our source code
      }),
    ],
  };
  const outputOptions = {
    format: 'iife',
    name: 'app',
    file: tool.convertSrcToDest(filePath, 'js'),
    //dir: destDir,// 複数ファイルの場合必要
    sourcemap: true,
  };

  try {
    //const bundle = await rollup.rollup(inputOptions);
    const bundle = await rollup(inputOptions);
    return bundle.write(outputOptions);
  } catch (error) {
    console.error('rollup compile error', error);
  }
};

/**
 * jsの全体コンパイル & ファイルコピー
 */
export const dest = async () => {
  try {
    const files = await glob(config.js.src);
    const promises = files.map((file) => {
      return compile(path.normalize(file));
    });
    await Promise.all(promises);
    console.log('finish all js compile.');
  } catch (error) {
    console.error('rollup dest error', error);
  }
};

/**
 * srcのwatch
 */
export const watch = () => {
  const bs = _bs.get(config.name);
  const watch = bs.watch(config.js.watch);

  watch.on('ready', () => {
    watch
      .on('add', async (filePath) => {
        try {
          await dest(filePath);
          bs.reload();
          console.log(`finish ${filePath} add.`);
        } catch (error) {
          console.log('js add error');
          console.log(error);
        }
      })
      .on('change', async (filePath) => {
        try {
          await dest(filePath);
          bs.reload();
          console.log(`finish ${filePath} change.`);
        } catch (error) {
          console.log('js change error');
          console.log(error);
        }
      })
      .on('unlink', async (filePath) => {
        try {
          await dest(filePath);
          bs.reload();
          console.log(`finish ${filePath} delete.`);
        } catch (error) {
          console.log('js delete error');
          console.log(error);
        }
      });
  });
};
