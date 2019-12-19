const config = require("./config");
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: config.mainJs, //已多次提及的唯一入口文件
    output: {
        path: config.path, //打包后的文件存放的地方
        filename: config.jsPath //打包后输出文件的文件名
    },

    //以下是服务环境配置
    devServer: {
        contentBase: config.server,//本地服务器所加载的页面所在的目录
        before(app) {
            app.use(bodyParser.json({limit: '50mb'}));
            app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

            /*app.get("/get", function(req, res) {
                console.log("获取请求");
                res.json({ custom: 'response' });
            });*/

            //处理当前模糊图片保存
            app.post("/", function (req, res) {
                //接收前台POST过来的base64
                var imgData = req.body.imgData;
                //过滤data:URL
                var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');

                console.log(req.body.path);
                fs.writeFile(path.resolve(__dirname, "../public/"+req.body.path+"filter.png"), dataBuffer, function(err) {
                    if(err){
                        res.send(err);
                    }else{
                        res.send("保存成功！");
                    }
                });
            });
        },
        inline: true,//实时刷新
        open: true,
        //host: "192.168.0.232"
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
    }
};