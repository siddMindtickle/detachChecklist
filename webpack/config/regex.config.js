const { Dir } = require("./env.config");

const Regex = {
    styles:/\.scss$/,
    libStyles:/\.css$/,
    lessStyles: /\.less$/,
    scripts: /\.js$/,
    images: /\.(jpe?g|png|gif)$/i,
    fonts: /\.(woff|woff2|eot|ttf|svg)$/i,
    document: /.*\.html$/,
    nodeModules: /node_modules/,
    excludeHTML: /(?![html])([a-z]+)\/?(\?(.+))?$/,
};

module.exports = Regex;
