const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'
const config = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        app: './src/js/app.js',
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: `${__dirname}/node_modules/`,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            },
            {
                test: /.(sa|sc|c)ss$/,
                use: [
                    isDevelopment ?
                        {
                            loader: 'style-loader/url',
                            options: {
                                singleton: true,
                                sourceMap: true,
                            },
                        }:
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'css/[name].css',
                        },
                    },
                    {
                        loader: 'extract-loader',
                        options: {
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            //minimize: true,
                            sourceMap: isDevelopment,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer')({grid: true})
                            ]
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment,
                        },
                    },
                ]
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: (path) => {
                                return path.replace(/^.*\/src\/ejs\/(.*)\.ejs/, '$1.html')
                            },
                        },
                    },
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            attr: ['img:src', 'link:href']
                        },
                    },
                    {
                        loader: 'ejs-html-loader',
                        options: {
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: (path) => {
                                return path.replace(/^.*\/src\//, '')
                            },
                        },
                    },
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            attr: ['img:src', 'link:href']
                        },
                    },
                ],
            },
            {
                test: /.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 20,// 20kb
                            // for file-loader option.
                            // if file is large, follback to file-loader
                            name: (path) => {
                                return path.replace(/^.*\/src\//, '')
                            },
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: isDevelopment,
            }),
            new OptimizeCssAssetsPlugin({})
        ],
    },
}

module.exports = (env, argv) => {
    return config
}
