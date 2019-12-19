const webpack = require("webpack");
const config = require("./config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: config.mainJs, //已多次提及的唯一入口文件
    output: {
        path: config.path, //打包后的文件存放的地方
        filename: config.jsPath //打包后输出文件的文件名
    },

    module: {
        rules:[
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use:[
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                use:[
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: config.limit,
                        name: config.filePath
                    }
                }
            },
            {
                test: /\.(eot|woff|ttf|woff2)(\?|$)/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: config.limit,
                        name: config.filePath
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('nan出品，必出精品'), //文件自动添加内容
        //js 压缩混淆代码
        new UglifyJsPlugin(),
        //css文件配置
        new ExtractTextPlugin(config.cssPath)
    ],
};