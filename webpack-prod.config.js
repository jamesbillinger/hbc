/**
 * Created by jamesbillinger on 3/4/17.
 */
var path = require('path');
var webpack = require('webpack');
var os = require('os');
var AssetsPlugin = require('assets-webpack-plugin');

var include = [
  path.resolve(__dirname, 'config.json'),
  path.resolve(__dirname, 'app'),
  path.resolve(__dirname, 'public')
];
var config = require('./config.json');

var globals = {
  'process.env.NODE_ENV' : '"production"',
  'process.env.BABEL_ENV': '"production"',
  NODE_ENV: 'production'
};
var address;
var intfs = os.networkInterfaces();
if (intfs && intfs.en0 && intfs.en0.length > 0) {
  intfs.en0.map(function(i) {
    if (!address && i.address && (i.address.startsWith('172.') || i.address.startsWith('10.'))) {
      address = i.address;
    }
  });
}
if (!address) {
  address = '127.0.0.1';
}
console.log('binding to ' + address);

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: ['whatwg-fetch', 'babel-polyfill', './app']
  },
  output: {
    path: path.join(__dirname, '/files/dist'),
      publicPath: '/dist/',
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'vendor',
      children: true,
      minChunks: 2
    }),
    new AssetsPlugin({
      filename: '/files/dist/assets.json'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    //new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, minimize: true}),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      //exclude: 'excluded',
      compress: {
        drop_debugger: true,
        warnings: false,
        unused: false,
        drop_console: true
      }
    }),
    new webpack.DefinePlugin(globals)
  ],
  resolve : {
    //extensions : ['', '.js', '.jsx', '.css'],
    modules: [
      path.join(__dirname, '/app'),
      "node_modules"
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$|\.es6$|\.babel$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'app'),
        query: {
          cacheDirectory:'./webpack_cache/',
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-react-constant-elements', 'transform-decorators-legacy']
        }
      },
      {test: /\.css?$/, loaders: ['style-loader', 'raw-loader'], include: include},
      /*{test: /\.less$/,loader: 'style-loader!css-loader!less-loader', include: include},
      {test: /\.eot/, loader: 'file-loader', include: include},
      {test: /\.svg/, loader: 'file-loader', include: include},
      {test: /\.gif$/, loader: "url-loader?mimetype=image/png", include: include},
      {test: /\.png$/, loader: "url-loader?mimetype=image/png", include: include},
      {test: /\.jpg$/, loader: "url-loader?mimetype=image/png", include: include},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff", include: include},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[name].[ext]", include: include},
      {test: require.resolve("react-addons-perf"), loader: "expose?Perf", include: include},*/
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {test: /\.json$/, loader: "json-loader", include: include}
    ]
  }
};