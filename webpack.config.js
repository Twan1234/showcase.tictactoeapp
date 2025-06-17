// webpack.config.js
const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
