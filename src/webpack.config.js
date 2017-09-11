const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


// var webpackStream = require( 'webpack-stream' );


// webpackStream(config, require('webpack'));



module.exports = {
	entry: [
		'./main',
		'./style'
	],
	output: {
		filename: '[name].js',
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
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }
			// {
            //     test: /\.less$/,
			// 	exclude: [
			// 		path.resolve(__dirname, 'node_modules')
			// 	],
			// 	use: [{
			// 		loader: "style-loader"
			// 	},{
			// 		loader: "css-loader"
			// 	}, {
			// 		loader: "less-loader"
			// 	}]
			// }
			, {
				test: /\.(jpg|png|svg)$/,
				loader: 'url-loader',
				options: {
				  	limit: 25000,
				},
			}
        ]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']
	},
	
	devServer: {
		contentBase: path.join(__dirname, "./"),
		compress: true,
		port: 8080
	},
	plugins: [
		new CheckerPlugin(),
		new ExtractTextPlugin("[name].css")
	]	
};
