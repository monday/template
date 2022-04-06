export const config = {
	name: 'template',
	//port: 3010,
	encoding: 'utf8',
	src: 'src',
	dest: 'dest',
	ejs: {
		src: 'src/ejs/**/!(_)*.ejs',
		watch: 'src/ejs/**/*.ejs'
	},
	css: {
		src: 'src/css/style.css',
		watch: 'src/css/**/*.css'
	},
	js: {
		src: 'src/js/app.js',
		watch: 'src/js/**/*.js'
	},
	image: {
		src: 'src/images/**/*.*',
		watch: 'src/images/**/*.*'
	},
};
