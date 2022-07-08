const CompressionPlugin = require("compression-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer");
const path = require("path");

module.exports = {
    watch: true,
    entry: './src/index.ts',
    plugins: [new CompressionPlugin(), new WebpackBundleAnalyzer.BundleAnalyzerPlugin()],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};