const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./indexAsync.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      {
        test: /\.hbs$/i,
        use: {
          loader: "handlebars-loader",
        },
      },
      {
        test: /\.html$/i,
        use: { loader: "html-loader" },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin((percentage, message) => {
      console.log(`${(percentage * 100).toFixed()}% ${message}`);
    }),
  ],
};
