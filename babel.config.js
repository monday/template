module.exports = (api) => {
    api.cache(true)

    const presets =  [
        ['@babel/preset-env'],
    ]

    const plugins = [
        ['wildcard', {
            'exts': ['js', 'ejs', 'es6', 'es', 'jsx', 'javascript'],
        }],
    ]

    return {
        presets,
        plugins,
    }
}