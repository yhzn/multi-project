let path=require('path');
let webpack=require('webpack');
let HtmlWebpackPlugin=require('html-webpack-plugin');
// 拆分css样式的插件
let ExtractTextWebpackPlugin=require('extract-text-webpack-plugin');
let CleanWebpackPlugin=require('clean-webpack-plugin');
let CopyWebpackPlugin=require('copy-webpack-plugin');
let glob=require('glob');

// 获取文件名
let globPath = 'src/**/view/*.html'; // 获取所有html文件路径
let pathDir = 'src(\/|\\\\)(.*?)(\/|\\\\)view';
let files = glob.sync(globPath);
let dirName='';
let entries=[];
let entry={}

let plugins = [
    new CleanWebpackPlugin('dist'),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextWebpackPlugin('css/style.css'),
    new CopyWebpackPlugin([{   // 拷贝静态目录文件
        from: path.join(__dirname,'static'),
        to: path.join(__dirname,'dist'),
        ignore: ['.*']
    }])
];
// 多页面配置
for (let i=0;i<files.length;i++){
    let name='';
    dirName=path.dirname(files[i]).replace(new RegExp('^' + pathDir), '$2'); //获取到 存放 html 文件的文件夹目录
    name=files[i].replace(new RegExp('^' + dirName+'/'),'').replace(new RegExp('.html$'),'');
    entries.push(name);
    entry[name]='./src/js/'+name+'.js';
    plugins.push(
        new HtmlWebpackPlugin({
            template: './src/view/'+name+'.html',
            filename: name+'.html', // 配置生成html目录
            chunks: [name], // 对应关系，对应的是 entry 中 key 值，index.js对应的是index.html
            hash: true,
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            }
        })
    )
}
module.exports= {
    entry,
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader:"css-loader",
                            options: {
                                minimize: true // css 文件压缩
                            }
                        },
                        {
                            loader:"postcss-loader"
                        }
                    ], // postcss-loader 前缀补全
                    publicPath: '../'

                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader:'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader:'less-loader'
                        }
                    ],
                    publicPath: '../'

                })
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'image'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins,
    devServer: {
        contentBase: path.join(__dirname, 'dist')
        // hot:true  // 开启后 css 样式改变页面不更新
    },
    resolve: {
        // 省略后缀
        extensions: ['.js', '.json', '.css', '.less']
    }
}