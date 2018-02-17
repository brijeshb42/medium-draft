const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV_DEV = 'development';
const ENV_PROD = 'production';

const env = process.env.NODE_ENV || ENV_DEV;
const isDev = env === ENV_DEV;
const isProd = env === ENV_PROD;

const pkg = require('./package.json');

const banner = [
  pkg.name,
  `Version - ${pkg.version}`,
  `Author - ${pkg.author}`,
].join('\n');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: isDev,
});

const bannerPlugin = new webpack.BannerPlugin(banner);

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(env === ENV_DEV),
  __PROD__: JSON.stringify(env === ENV_PROD),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
  'process.env': {
    NODE_ENV: JSON.stringify(env),
  },
});

const getPlugins = () => {
  const plugins = [
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
  ];

  if (isProd) {
    plugins.push(new UglifyJsPlugin());
  }

  plugins.push(extractSass);
  plugins.push(bannerPlugin);
  return plugins;
};

const config = {
  entry: {
    vendor: ['react', 'react-dom', 'medium-draft'],
    example: './src/index',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-env', 'babel-preset-react'],
          plugins: [
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-object-rest-spread',
          ],
        },
      },
    }, {
      test: /(\.css|\.scss)$/,
      use: extractSass.extract({
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
        fallback: 'style-loader',
      }),
    }],
  },
  plugins: getPlugins(),
};

module.exports = config;
