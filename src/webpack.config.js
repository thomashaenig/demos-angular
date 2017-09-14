const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLess = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
	entry: [
		'./main',
		'./style'],

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')},

	resolveLoader:{		 
		alias: {
			text: "raw-loader",
			css: "css-loader"
		}},	
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
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=public/fonts/[name].[ext]'
            },
			{
                test: /\.less$/,
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				use: extractLess.extract({
					use: [{
						loader: "css-loader"
					}, {
						loader: "less-loader"
					}],
					// use style-loader in development
					fallback: "style-loader"
				})
			}
			, {
				test: /\.(jpg|png|svg)$/,
				loader: 'url-loader',
				options: {
				  	limit: 25000,
				},
			}
        ]},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']},	
	devServer: {
		contentBase: path.join(__dirname, "./"),
		compress: true,
		port: 8080},
	plugins: [
		new CheckerPlugin(),
		extractLess]
};
