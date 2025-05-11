const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup/index.tsx',
    dashboard: './src/dashboard/index.tsx',
    background: './src/background/index.ts',
    contentScript: './src/content/gmail-integration.tsx'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new HTMLPlugin({
      template: './public/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HTMLPlugin({
      template: './public/dashboard.html',
      filename: 'dashboard.html',
      chunks: ['dashboard']
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/manifest.json", to: "manifest.json" },
        { from: "public/icons", to: "icons" }
      ],
    }),
  ],
};