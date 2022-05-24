/* eslint-disable @typescript-eslint/no-var-requires */
// node
const path = require("path");

// npm
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Pacman",
      filename: "index.html",
      template: "public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./public/assets",
          to: "./assets",
        },
      ],
    }),
    new webpack.ProgressPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // eslint-disable-next-line global-require
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        // Now we apply rule for static files
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf|mp3|ogg|mp4)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          context: "public",
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false,
              },
            ],
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
