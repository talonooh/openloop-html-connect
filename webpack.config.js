const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
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
	}
};
