const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const node_dir = __dirname + '/node_modules';

// require("expose-loader?TelemetryAgent!./src/telemetry_agent/dist/agent.js");
// require("expose-loader?configSettings!./src/telemetry_agent/dist/agent_config.js");
// require("expose-loader?TelemetryAgentPageData!./src/telemetry_agent/dist/agent_pagedata.js");
// require("expose-loader?TelemetryAgentProblems!./src/telemetry_agent/dist/agent_problems.js");
// require("expose-loader?TelemetryAgentSupportWidget!./src/telemetry_agent/dist/agent_support.js");


plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    jquery: "jquery",
    "window.jQuery": "jquery",
    "window.jquery": "jquery",
  }),
  // new CopyWebpackPlugin([
  //   { from: 'node_modules/jquery/dist/jquery.min.js', to: 'libs/jquery.js' },
  //   { from: 'node_modules/gmail-js/src/gmail.js', to: 'libs/gmail.js' },
  // ]),
  // new webpack.optimize.DedupePlugin(),
  // new webpack.optimize.OccurenceOrderPlugin(),
  // new webpack.optimize.UglifyJsPlugin({
  //   mangle: true,
  //   compress: {
  //     warnings: false,
  //   }
  // }),
  new ExtractTextPlugin('bundle.css', { allChunks: true })
];



module.exports = {
  // entry: [
  //     './src/background/background.js',
  // ],
  //
  // output: {
  //   path: path.join(__dirname, 'extension'),
  //   filename: 'bundle.js',
  // },
  node: {
    fs: "empty"
  },
  entry: {
    popup: "./src/popup/popup.js",
    background: "./src/background/background.js",
    content: "./src/content/content.js",
    options: './src/options/options.js'
    //bootstrap: 'bootstrap-loader',
  },

  output: {
    path: path.join(__dirname, 'extension/build'),
    filename: "[name]-bundle.js",
    publicPath: "/build/"
  },

  externals: [
    {
      "window": "window"
    }
  ],

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'jquery.jstree': node_dir + '/jstree/dist/jstree.js',
    }
  },

  plugins: plugins,

  module: {
    // preLoaders: [
    //     {
    //         test: /\.js/,
    //         loader: 'eslint-loader',
    //         exclude: /node_modules/
    //     }
    // ],
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.html/, loader: 'html' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      { test: /\.json$/, loaders: ['json']},
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },
      { test: /node_modules\/.+\.(jsx|js)$/,
        loader: 'imports?jQuery=jquery,$=jquery,this=>window'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /telemetry_agent\/.+\.(jsx|js)$/,
        loader: [
          'imports?jQuery=jquery,$=jquery,this=>window',
          "legacy"
        ]
      }
    ]
  },
  postcss: [autoprefixer]
};