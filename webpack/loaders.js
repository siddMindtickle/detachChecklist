const fs = require("fs");
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EnvConfig = require("./config/env.config");
const Regex = require("./config/regex.config");
const { Env, Dir } = EnvConfig;

const GetName = {
  images(hashing) {
    return hashing ? `assests-ui/images/[name].[hash].[ext]` : `assests-ui/images/[name].[ext]`;
  },
  fonts(hashing) {
    return hashing ? `assests-ui/fonts/[name].[hash].[ext]` : `assests-ui/fonts/[name].[ext]`;
  }
};

const optimiseImage = () => {
  return {
    loader: "image-webpack-loader",
    options: {
      gifsicle: {
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      pngquant: {
        quality: "65-90",
        speed: 4
      },
      mozjpeg: {
        progressive: true,
        quality: 65
      }
    }
  };
};

const loadImages = hashing => {
  return {
    loader: "url-loader",
    options: {
      limit: 10000,
      name: GetName.images(hashing)
    }
  };
};

const loadFonts = hashing => {
  return {
    loader: "file-loader",
    options: {
      name: GetName.fonts(hashing)
    }
  };
};

const lintJS = () => {
  return { loader: "eslint-loader" };
};

const transpileJS = () => {
  return {
    loader: "babel-loader",
    options: JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", ".babelrc")))
  };
};

const minimizeCSS = () => {
  return {
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ["last 2 versions"]
    },
    discardComments: {
      removeAll: true
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    safe: true
  };
};


const transformStyles = () => {
  return {
    loader: "sass-loader",
    options: {
      sourceMap: true,
      sassOptions: {
      functions: {
        "get($keys)": function(keys) {
          keys = keys.getValue().split(".");
          let result = sassVars;
          let i;
          for (i = 0; i < keys.length; i++) {
            result = result[keys[i]];
          }
          result = sassUtils.castToSass(result);
          return result;
        },
      },
    },
    },
  };
};

const processCSS = (optimise, hashing) => {
  let processing = {
    loader: "css-loader",
    options: {
      modules: true
    }
  };
  if (!hashing) processing.options.localIdentName = "[path][name]__[local]--[hash:base64:5]";
  if (optimise) processing.options.minimize = minimizeCSS();
  return processing;
};

const processLibCSS = optimise => {
  let processing = {
    loader: "css-loader",
    options: {}
  };
  if (optimise) processing.options.minimize = minimizeCSS();
  return processing;
};

const inlineCSS = () => {
  return { loader: "style-loader" };
};

const processImages = () => {
  const hashing = Env.IMAGE_HASHING || Env.HASHING;
  const optimise = Env.IMAGE_OPTIMISE || Env.OPTIMISE;
  let processing = {
    test: Regex.images,
    include: [Dir.APP, Dir.MT_CORE, Dir.MINDTICKLE_COMMON],
    use: []
  };
  processing.use.push(loadImages(hashing));
  if (optimise) processing.use.push(optimiseImage());
  return processing;
};

const processFonts = () => {
  const hashing = Env.FONT_HASHING || Env.HASHING;
  let processing = {
    test: Regex.fonts,
    include: [Dir.ROOT, Dir.MINDTICKLE_COMMON],
    use: []
  };
  processing.use.push(loadFonts(hashing));
  return processing;
};

const processScripts = () => {
  let processing = {
    test: Regex.scripts,
    include: [Dir.APP, Dir.MT_CORE, Dir.MINDTICKLE_COMMON],
    use: []
  };
  processing.use.push(transpileJS());
  processing.use.push(lintJS());

  return processing;
};

const processStyles = () => {
  const hashing = Env.STYLE_HASHING || Env.HASHING;
  const optimise = Env.STYLE_OPTIMISE || Env.OPTIMISE;
  const chunking = Env.STYLE_CHUNKING || Env.CHUNKING;
  let processing = {
    test: Regex.styles,
    include: [Dir.APP, /mt-ui/],
    use: []
  };
  if (chunking) {
    processing.use.push(MiniCssExtractPlugin.loader);
  } else {
    processing.use.push(inlineCSS());
  }
  processing.use.push(processCSS(optimise, hashing));
  processing.use.push(transformStyles());
  return processing;
};

const processLibStyles = () => {
  const optimise = Env.STYLE_OPTIMISE || Env.OPTIMISE;
  const chunking = Env.STYLE_CHUNKING || Env.CHUNKING;

  let processing = {
    test: Regex.libStyles,
    include: [/node_modules/],
    use: []
  };
  if (chunking) {
    processing.use.push(MiniCssExtractPlugin.loader);
  } else {
    processing.use.push(inlineCSS());
  }
  processing.use.push(processLibCSS(optimise));

  return processing;
};

const processLessStyles = () => {
  let processing = {
    test: Regex.lessStyles,
    use: [],
  };
  processing.use.push(inlineCSS());
  processing.use.push(processLibCSS());
  processing.use.push({
    loader: "less-loader",
    options: {
      javascriptEnabled: true,
    },
  });

  return processing;
};

module.exports = {
  ImagesLoaders: processImages(),
  FontsLoaders: processFonts(),
  ScriptsLoaders: processScripts(),
  StylesLoaders: processStyles(),
  LibStylesLoaders: processLibStyles(),
  LessStylesLoaders:processLessStyles()
};
