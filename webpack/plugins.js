const webpack = require("webpack");
const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

const { Dir, Env } = require("./config/env.config");
const Regex = require("./config/regex.config");

const globals = () => [
  new webpack.DefinePlugin({
    "process.env.MOCK": Env.MOCK,
    "process.env.isDev": Env.NODE_ENV == "development"
  })
];

const extractCSS = () => {
  const hashing = Env.IMAGE_HASHING || Env.HASHING;
  const nameConvention = hashing
    ? "assests-ui/styles/[name].[chunkhash].chunk.css"
    : "assests-ui/styles/[name].chunk.css";
  return [
    new MiniCssExtractPlugin({
      filename: nameConvention,
      chunkFilename: nameConvention
    })
  ];
};

const template = minify => {
  const trackingConfig = {
    TRACKING: Env.TRACKING,
    NEW_RELIC_LICENCE: Env.NEW_RELIC_LICENCE,
    NEW_RELIC_APPLICATION_ID: Env.NEW_RELIC_APPLICATION_ID,
    MIXPANEL_PROJECT_ID: Env.MIXPANEL_PROJECT_ID
  };
  return [
    new HtmlWebpackPlugin({
      template: Path.resolve(Dir.APP, "index.tmpl.ejs"),
      cache: true,
      minify: minify && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      favicon: Path.resolve(Dir.APP, "images", "favicon.ico"),
      environment: JSON.stringify(trackingConfig)
    })
  ];
};

const compress = () => [
  new CompressionPlugin({
    test: Regex.excludeHTML,
    asset: "[path]"
  })
];

const handleErrors = () => [
  new CircularDependencyPlugin({
    exclude: Regex.nodeModules,
    failOnError: true
  })
];

const performance = () => [
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: "defer"
  })
];

const duplicate = () => [
  new DuplicatePackageCheckerPlugin({
    verbose: true,
    emitError: false,
    showHelp: false
  })
];

const copyMock = () => [
  new CopyWebpackPlugin([
    {
      from: Path.resolve(Dir.APP, "mock"),
      to: Path.resolve(Dir.DIST, "mock")
    }
  ])
];

module.exports = {
  ChunkCssPlugins: extractCSS(),
  CreateTemplatePlugins: template(),
  CompressPlugins: compress(),
  HandleErrorsPlugins: handleErrors(),
  AddGlobalsPlugin: globals(),
  PerformancePlugins: performance(),
  CopyMockPlugin: copyMock(),
  CheckDuplicatePlugin: duplicate()
};
