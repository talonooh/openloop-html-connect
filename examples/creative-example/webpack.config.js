var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackCleanPlugin = require('webpack-clean');

module.exports = {
    context: __dirname,
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("src/styles.css"),
        new HtmlWebpackPlugin({
            inject: true,
            cache: false,
            filename: 'index.html',
            title: 'QDOT HTML5 Creative Sample',
            inlineSource: '.(js|css)$' // embed all javascript and css inline
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new WebpackCleanPlugin([
            './dist/*.js',
            './dist/*.css',
            './dist/src'
        ])
    ]
};
