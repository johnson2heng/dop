let webpack = require("webpack");

module.exports = {
    //devtool: 'source-map', //调试配置，生成source maps
    entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public/",//打包后的文件存放的地方
        filename: "js/index.js"//打包后输出文件的文件名
    },

    //以下是服务环境配置
    devServer: {
        contentBase: "./public/",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },

    /*plugins: [
        //压缩代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],*/

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: "jsx-loader"
            }, {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader', 'autoprefixer-loader']
            }, {
                test: /\.less/,
                loaders: ['style-loader', 'css-loader', 'autoprefixer-loader', 'less-loader']
            }, {
                test: /\.(eot|woff|svg|ttf|woff2|gif)(\?|$)/,
                loader: 'file-loader?name=[hash].[ext]'
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=1200&name=[hash].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            }
        ]
    }
};
