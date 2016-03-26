var path = require('path');
// ファイルの追加を監視するため相対パスに
var dest = path.relative('.', 'dest');
var src = path.relative('.', 'src');
var domain = 'www.test.com';

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
	js: {
		src: src + '/js'
	},
	copy: {
		src: [
			src + '/images/**',
			src + '/css/fonts/**',
			src + '/js/**'
		],
	},
	sprite: {
		src: [
			src + '/images/sprite/*.png'
		],
		dest: {
			image: src + '/images/',
			css: src + '/styl/'
		}
	},
	bs: {
	}
};
