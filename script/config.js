const config = {
	name: 'template',
	port: 3010,
	encoding: 'utf8',
	src: 'src',
	dest: 'dest',
	ejs: {
		src: 'src/ejs/**/!(_)*.ejs',
		watch: 'src/ejs/**/*.ejs'
	},
	sass: {
		src: 'src/css/**/!(_)*.scss',
		watch: 'src/css/**/*.scss'
	},
	copy: {
		files: ['html', 'css'],
		images: ['png', 'jpg', 'jpeg', 'gif', 'ico'],
		fonts: ['eot', 'woff', 'woff2', 'ttf', 'otf'],
	}
}

// コピーするファイルの拡張子からglobを生成する
config.copy.pattern = () => {
	const copy = config.copy;
	const extension = [copy.files, copy.images, copy.fonts].reduce((a, b) => {
		return a.concat(b);
	});

	return 'src/**/*.@(' + extension.join('|') + ')'
};



module.exports = config;
