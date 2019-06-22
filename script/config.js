'use strict';
const config = {
	name: 'template',
	//port: 3010,
	encoding: 'utf8',
	src: 'src',
	dest: 'dest',
	ejs: {
		src: 'src/ejs/**/!(_)*.ejs',
		watch: 'src/ejs/**/*.ejs'
	},
	sass: {
		src: 'src/scss/style.scss',
		watch: 'src/scss/**/*.scss'
	},
	js: {
		src: 'src/js/app.js',
		watch: 'src/js/**/*.js'
	},
	copy: {
		//files: ['html', 'css', 'json'],
		files: [],
		images: ['png', 'jpg', 'jpeg', 'gif', 'ico'],
		fonts: ['eot', 'woff', 'woff2', 'ttf', 'otf'],
	}
};

module.exports = config;
