const resolve = require("path").resolve;
const { Dir, Env } = require("./config/env.config");
const {
  ImagesLoaders,
  FontsLoaders,
  ScriptsLoaders,
  StylesLoaders,
  LibStylesLoaders,
  LessStylesLoaders
} = require("./loaders");

const {
  ChunkCssPlugins,
  AddGlobalsPlugin,
  PerformancePlugins,
  HandleErrorsPlugins,
  CheckDuplicatePlugin,
  CreateTemplatePlugins,
  CaseSensitivePathsPlugin
} = require("./plugins");

const config = {};
config.mode = Env.NODE_ENV;

config.entry = {
  app: resolve(Dir.APP, "index.js")
};

config.output = {
  publicPath: Env.PUBLIC_PATH,
  path: Dir.DIST,
  filename: "assests-ui/[name].js",
  chunkFilename: "assests-ui/[name].chunk.js",
  crossOriginLoading: "anonymous"
};
config.devtool = Env.NODE_ENV !== "production" ? "inline-source-map" : false;
config.stats = "normal";

config.resolve = {
  symlinks: false,
  alias: {
    "~": resolve(__dirname, "../","app"),
    commonStyles: resolve(__dirname, Dir.MINDTICKLE_COMMON + "/styles"),
    styles: resolve(__dirname, Dir.MINDTICKLE_COMMON + "/styles"),
    images: resolve(__dirname, Dir.MT_CORE + "/images"),
    fonts: resolve(__dirname, Dir.MINDTICKLE_COMMON + "/styles/fonts"),
    react: resolve(__dirname, "../node_modules", "react"),
    "react-dom": resolve(__dirname, "../node_modules", "react-dom"),
    "styled-components": resolve(__dirname, "../node_modules", "styled-components"),
    "mt-ui-components": Dir.MINDTICKLE_COMMON,
    "@mindtickle/mt-ui-components": Dir.MINDTICKLE_COMMON,
    "mt-ui-core": Dir.MT_CORE,
		"@mt-ui-core":Dir.MT_CORE,
    "@locales": resolve(__dirname, "../app/locales_learner"),
    "@locale_learner":resolve(__dirname, "../app/locales_learner"),
    "@core": resolve(__dirname, "../app/core"),
    "@config": resolve(__dirname, "../app/config"),
    "@components": resolve(__dirname, "../app/components"),
    "@app": resolve(__dirname, "../app"),
    "appStyles":resolve(__dirname, "../app/appStyles"),
    "@utils": resolve(__dirname, "../app/utils"),
    "@hocs": resolve(__dirname, "../app/hocs"),
    "@modules": resolve(__dirname, "../app/modules"),
    "@api": resolve(__dirname, "../app/api"),
    "@mixpanel": resolve(__dirname, "../app/mixpanel"),
    "@containers": resolve(__dirname, "../app/containers"),
    "@uielements": resolve(__dirname, "../app/components/uielements"),
  }
};

config.devServer = {
  port: Env.SERVER_PORT,
  historyApiFallback: true,
  disableHostCheck: true,
  watchContentBase: true,
  hot: true
};

config.module = {
  rules: [ImagesLoaders, FontsLoaders, ScriptsLoaders, StylesLoaders, LibStylesLoaders, LessStylesLoaders]
};

config.plugins = [...AddGlobalsPlugin, ...CreateTemplatePlugins, ...HandleErrorsPlugins];

config.optimization = {
  runtimeChunk: true,
  splitChunks: {
    chunks: "all"
  }
};

if (Env.STYLE_CHUNKING || Env.CHUNKING) {
  config.plugins = config.plugins.concat(ChunkCssPlugins);
}

if (Env.SCRIPT_HASHING || Env.HASHING) {
  config.output.filename = "assests-ui/js/[name].[chunkhash].js";
  config.output.chunkFilename = "assests-ui/js/[name].[chunkhash].chunk.js";
}

if (Env.OPTIMISE || Env.SCRIPT_OPTIMISE) {
  config.plugins = config.plugins.concat([...PerformancePlugins, ...CheckDuplicatePlugin]);
}

if (Env.ENFORCE_CASE_SENSITIVE) {
  config.plugins = config.plugins.concat([...CaseSensitivePathsPlugin]);
}

module.exports = config;
