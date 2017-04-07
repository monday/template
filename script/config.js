const config = {
	dest: 'dest',
	port: 3010,
	//exclude: 'partial'
	copy: {
		files: ['html', 'css'],
		images: ['png', 'jpg', 'jpeg', 'gif', 'ico'],
		fonts: ['eot', 'woff', 'woff2', 'ttf', 'otf'],
	}
}

config.copy.pattern = () => {
	const copy = config.copy;
	const extension = [copy.files, copy.images, copy.fonts].reduce((a, b) => {
		return a.concat(b);
	});

	return 'src/**/*.@(' + extension.join('|') + ')'
};



module.exports = config;
