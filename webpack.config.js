const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    const isProduction = env === 'production';
    return {
        entry: ['babel-polyfill', './src/index.js'],
        output: {
            path: path.join(__dirname, 'public', 'dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[name].bundle.js'
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        module: {
            rules: [{
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                },{
                    loader: 'sass-loader',
                    options: {sourceMap: true}
                }]
            }
        ]},
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'styles_bundle.css',
                chunkFilename: "styles/[id].css"
            })
        ],
        devtool: isProduction ? 'source-map' : 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true,
            publicPath: '/dist/'
        }
    }
}