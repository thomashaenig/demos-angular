const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	entry: [
		'./main',
		"./style.less"
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},

	resolveLoader:{		 
		alias: {
			text: "raw-loader"
		}
	},
	
	module: {
		
		rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
					emitErrors: true,
				}
			},		
			{
                test: /\.tsx?$/,
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				loader: 'awesome-typescript-loader'
            },
			{
                test: /\.less$/,
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				use: [{
					loader: "style-loader"
				},{
					loader: "css-loader"
				}, {
					loader: "less-loader"
				}]
            }, {
				test: /\.(jpg|png|svg)$/,
				loader: 'url-loader',
				options: {
				  	limit: 25000,
				},
			}
        ]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', 'less']
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
