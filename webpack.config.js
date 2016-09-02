/* eslint-disable */

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

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
    plugins.push(new DashboardPlugin());
    plugins.push(new webpack.NoErrorsPlugin());
    plugins.push(vendorPlugin);
    plugins.push(commonsPlugin);
  } else {
    plugins.push(new ExtractTextPlugin('[name].css'));
    // plugins.push(new ExtractTextPlugin(isDev ? '[name].css' : '[name].[hash].css'));
    plugins.push(hashJsonPlugin);
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      compress: {
        warnings: false,
        dead_code: true,
      },
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
    entries.push('webpack-dev-server/client?http://localhost:8080/');
    entries.push('webpack/hot/only-dev-server');
    entries.push('./index');
  } else {
    entries = ['./index'];
  }
  // entries.push('babel-polyfill');
  
  entry['medium-draft'] = entries;
  entry.example = './example';
  return entry;
}

function getLoaders(env) {
  var loaders = [];
  loaders.push({
    test: /\.jsx?$/,
    include: APP_DIR,
    loader: env !== ENV_PROD ? 'react-hot!babel' : 'babel',
    exclude: /node_modules/
  });

  loaders.push({
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'file'
  });

  if (env === ENV_PROD ) {
    loaders.push({
      test: /(\.css|\.scss)$/,
      loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap")
    });
  } else {
    loaders.push({
      test: /(\.css|\.scss)$/,
      loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
    });
  }
  return loaders;
}


var options = {
  context: APP_DIR,
  debug: !isProd,
  devtool: isProd  ? '' : 'cheap-module-eval-source-map',
  entry: getEntry(env),
  target: 'web',
  output: {
    path: BUILD_DIR,
    publicPath: '/static/',
    filename: '[name].js',
    // filename: env === ENV_DEV ? '[name].js' : '[name].[hash].js',
    chunkFilename: '[id].[hash].bundle.js',
    sourceMapFile: '[file].map',
    hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    library: ['MediumDraft'],
    libraryTarget: 'umd',
  },
  plugins: getPlugins(env),
  module: {
    loaders: getLoaders(env),
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: APP_DIR,
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: APP_DIR,
    modulesDirectories: ['node_modules'],
  }
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
      'react-addons-css-transition-group': {
        root: ['React','addons','CSSTransitionGroup'],
        commonjs2: 'react-addons-css-transition-group',
        commonjs: 'react-addons-css-transition-group',
        amd: 'react-addons-css-transition-group',
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

module.exports = options;
