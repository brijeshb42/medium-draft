/* eslint-disable */

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV_DEV = 'development';
var ENV_PROD = 'production';
var ENV_TEST = 'test';

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var env = process.env.NODE_ENV || ENV_DEV;

var isDev = env === ENV_DEV;
var isProd = env === ENV_PROD;
var isTest = env === ENV_TEST;

console.log(env);

var pkg = require('./package.json');
var banner = [
  pkg.name,
  'Version - ' + pkg.version,
  'Author - ' + pkg.author
].join('\n');

var bannerPlugin = new webpack.BannerPlugin(banner);

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(env === ENV_DEV),
  __PROD__: JSON.stringify(env === ENV_PROD),
  __TEST__: JSON.stringify(env === ENV_TEST),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
  'process.env.NODE_ENV': '"' +env+ '"'
});
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'common',
  minChunks: 3,
});
// var vendorBase = new webpack.optimize.CommonsChunkPlugin("vendor-base", "vendor-base.js", Infinity);
var vendorPlugin = new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor-react'],
  minChunks: Infinity,
  filename: '[name].js',
  // filename: isDev ? '[name].js' : '[name].[hash].js'
});

var hashJsonPlugin = function() {
  this.plugin("done", function(stats) {
    require("fs").writeFileSync(
      path.join(__dirname, "hash.json"),
      JSON.stringify(stats.toJson()["assetsByChunkName"]));
  });
};

function getPlugins(env) {
  var plugins = [definePlugin];
  if (!isProd) {
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
    plugins.push(vendorPlugin);
    plugins.push(commonsPlugin);
  } else {
    plugins.push(new ExtractTextPlugin('[name].css'));
    // plugins.push(new ExtractTextPlugin(isDev ? '[name].css' : '[name].[hash].css'));
    plugins.push(hashJsonPlugin);
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      output: { comments: false },
      debug: false,
      compress: { warnings: false, dead_code: true }
    }));
    plugins.push(bannerPlugin);
  }
  return plugins;
}


function getEntry(env) {
  var entry = {};
  var entries = [];
  if (env !== ENV_PROD) {
    entry['vendor-react'] = [
      'babel-polyfill',
      'react',
      'react-dom',
      'immutable',
      'draft-js',
    ]
    entries.push('./index');
  } else {
    entries = ['./index'];
  }
  entry['medium-draft'] = entries;
  entry.example = './example';
  entry['basic'] = './basic.scss';
  return entry;
}

function getLoaders(env) {
  var loaders = [];
  loaders.push({
    test: /\.jsx?$/,
    include: APP_DIR,
    loader: env !== ENV_PROD ? 'react-hot-loader!babel-loader' : 'babel-loader',
    exclude: /node_modules/
  });

  // loaders.push({
  //   test: /\.jsx?$/,
  //   loaders: 'eslint-loader',
  //   enforce: "pre",
  //   include: APP_DIR,
  // });

  loaders.push({
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'file-loader'
  });

  loaders.push({ test: /\.json$/, loader: 'json-loader' });

  if (env === ENV_PROD ) {
    loaders.push({
      test: /(\.css|\.scss)$/,
      loader: ExtractTextPlugin.extract("css-loader?sourceMap&minimize!sass-loader?sourceMap")
    });
  } else {
    loaders.push({
      test: /(\.css|\.scss)$/,
      loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
    });
  }
  return loaders;
}


var options = {
  context: APP_DIR,
  devtool: isProd  ? '' : 'cheap-module-eval-source-map',
  entry: getEntry(env),
  target: 'web',
  output: {
    path: BUILD_DIR,
    publicPath: '/static/',
    filename: '[name].js',
    // filename: env === ENV_DEV ? '[name].js' : '[name].[hash].js',
    chunkFilename: '[id].[hash].bundle.js',
    hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    library: ['MediumDraft'],
    libraryTarget: 'umd',
  },
  plugins: getPlugins(env),
  module: {
    loaders: getLoaders(env),
  },
  resolve: {
    modules: [
      APP_DIR,
      'node_modules'
    ],
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: false,
    noInfo: false,
  },
};

if (isProd) {
  options.externals = [{
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    },
    {
      'react-transition-group/CSSTransitionGroup': {
        root: ['React', 'addons', 'CSSTransitionGroup'],
        commonjs2: 'react-transition-group/CSSTransitionGroup',
        commonjs: 'react-transition-group/CSSTransitionGroup',
        amd: 'react-transition-group/CSSTransitionGroup',
      }
    },
    {
      immutable: {
        root: 'Immutable',
        commonjs2: 'immutable',
        commonjs: 'immutable',
        amd: 'immutable'
      }
    },
    {
      'draft-js': {
        root: 'Draft',
        commonjs2: 'draft-js',
        commonjs: 'draft-js',
        amd: 'draft-js'
      }
    }
  ];
}

var appExportType = process.env.APP_EXPORT_TYPE || '';

if (appExportType === 'exporter' || appExportType === 'importer') {
  console.log('Building HTML ' + appExportType);
  options.entry = {
    ['medium-draft-' + appExportType]: './' + appExportType,
  };
  var globalName = 'MediumDraft' + appExportType[0].toUpperCase() + appExportType[1] + 'porter';
  options.output.library = globalName
  options.externals.push({
    'react-dom/server': {
      root: 'ReactDOMServer',
      commonjs2: 'react-dom/server',
      commonjs: 'react-dom/server',
      amd: 'react-dom/server'
    }
  });
  options.externals.push({
    'draft-convert': {
      root: 'DraftConvert',
      commonjs2: 'draft-convert',
      commonjs: 'draft-convert',
      amd: 'draft-convert'
    }
  });
}

module.exports = options;
