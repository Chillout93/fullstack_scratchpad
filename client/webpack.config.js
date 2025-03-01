const HtmlWebpackPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");

module.exports = (env) => ({
  mode: "development",
  entry: "./src/index.tsx",
  devtool: false,
  output: {
    publicPath: "/",
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.(webp|jpe?g|svg|png)$/i,
        loader: "file-loader",
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 4000
  },
});
