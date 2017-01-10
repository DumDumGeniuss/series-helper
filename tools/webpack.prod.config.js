var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
 
var config = {
	context: path.join(__dirname, '..'),
	entry: [
		'./src/client.js',
	],
	output: {
		path: path.join(__dirname, '..', 'public', 'dist'),
		publicPath: '/dist/',
		filename: 'bundle-[hash].js',
	},
	module: {
		loaders: [
			{
				test:/\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				},
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true'),
			},
			{
				test: /\.(eot|ttf|wav|mp3)$/,
				loader: 'file-loader',
			},
			{
				test: webpackIsomorphicToolsPlugin.regular_expression('images'),
				loader: 'url-loader?limit=10240'
			},
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.API': JSON.stringify(process.env.API)
		}),
		new ExtractTextPlugin('style-[hash].css'),
		webpackIsomorphicToolsPlugin,
	]
};

module.exports = config;
