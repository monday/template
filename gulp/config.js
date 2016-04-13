var path = require('path');
// ファイルの追加を監視するため絶対パスに
var dest = path.resolve('dest');
var src = path.resolve('src');
var domain = 'template.local';

module.exports = {
	src: src,
	dest: dest,
	domain: domain,
	ejs: {
		src: src + '/ejs/**/!(_)*.ejs',
		watch: src + '/ejs/**/*.ejs',
		dest: dest
	},
	sass: {
		src: src + '/css/**/*.scss',
		dest: dest + '/css'
	},
	copy: {
		src: [
			src + '/images/**',
			src + '/css/fonts/**',
		],
	},
	sprite: {
		src: [
			src + '/images/sprite/*.png'
		],
		dest: {
			image: src + '/images/',
			css: src + '/css/'
		}
	},
	webpack: {
		src: src + '/js/app.js',
		watch: src + '/js/**/*.js',
		dest: dest + '/js'
	},
	bs: {
	}
};
