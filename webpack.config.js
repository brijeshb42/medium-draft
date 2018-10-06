const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');

const banner = [
  `${pkg.name}`,
  `Version - ${pkg.version}`,
  `Author - ${pkg.author}`,
  '',
].join('\n');

function getOutput(isProd = false) {
  const data = {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  };

  if (isProd) {
    data.libraryTarget = 'umd';
    data.library = 'MediumDraft';
    data.globalObject = 'self';
  }

  return data;
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    target: 'web',
    mode: argv.mode,
    entry: {
      'medium-draft': isProd ? './src/index.ts' : './src/demo.tsx',
    },
    output: getOutput(isProd),
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    },
    devtool: isProd ? '' : 'source-map',
    module: {
      rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      }, {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      }],
    },
    plugins: isProd ? [
      new webpack.BannerPlugin(banner),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new OptimizeCSSAssetsPlugin(),
    ] : [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    externals: isProd ? {
      'react': {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
      },
      'draft-js': {
        root: 'Draft',
        commonjs: 'draft-js',
        commonjs2: 'draft-js',
        amd: 'draft-js',
      },
      immutable: {
        root: 'Immutable',
        commonjs2: 'immutable',
        commonjs: 'immutable',
        amd: 'immutable'
      }
    } : {},
  }
};
