const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, './'),
		libraryTarget: 'umd',
		library: 'openLoopConnect',
		globalObject: 'this'
	},
	resolve: {
		extensions: [".js", ".json"],
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules')
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			OPENLOOP_HTML_CONNECT_VERSION: JSON.stringify(package.version),
		})
	]
};
