const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                loader: 'webpack-modernizr-loader',
                options: {
                    options: [
                        "setClasses"
                    ],
                    "feature-detects": []
                },
                test: /empty-alias-file\.js$/
            }
        ]
    },
    resolve: {
        alias: {
            modernizr$: path.resolve(__dirname, "dist/js/modernizr-custom.js")
        }
    }
};