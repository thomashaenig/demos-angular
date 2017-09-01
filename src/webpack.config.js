const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	entry: './main',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),		
	},
	
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				loader: 'awesome-typescript-loader'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, "./"),
		compress: true,
		port: 8080
	},
	plugins: [
		new CheckerPlugin()
	]
	
};
