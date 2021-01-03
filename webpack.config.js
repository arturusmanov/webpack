const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => { // убрать линние пробелы при компиляции
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`; // name, hash - паттерны вебпака

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
        options: {
        publicPath: '', // если нет publicPath - возникает ошибка
      },
    },
    'css-loader', // лоадеры снизу вверх, по этому less последний
  ];

  if (extra) {
    loaders.push(extra)
  }

  return loaders;
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}

const jsLoaders = (preset) => {
  const use = [
    {
      loader: 'babel-loader',
      options: babelOptions(preset)
    }
  ];

  if (isDev) {
    use.push({ loader: 'eslint-loader' });
  }

  return use;
}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({ // меняеть бандлы в html файле
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: path.resolve(__dirname, 'src/favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ]
      }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    })
  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
}

console.log('isDev', isDev);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  // Подключили jQuery, и при использую в 2ух точках входа он компилировался в каждой
  optimization: optimization(),
  // Для автопрезагрузки страницы
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: cssLoaders() // Для подключения css файлов через webpack
      },
      {
        test: /\.(less)$/,
        use: cssLoaders('less-loader') // Для подключения css файлов через webpack
      },
      {
        test: /\.(s[ac]ss)$/,
        use: cssLoaders('sass-loader'), // Для подключения css файлов через webpack
      },
      {
        test: /\.(png|jpg|svg|gif)$/, // Подключение картинок
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      // babel
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // игнор
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/, // игнор
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/, // игнор
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      }
    ]
  }
}