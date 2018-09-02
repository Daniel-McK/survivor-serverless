const path = require("path");

module.exports = {
  entry: {
    createSeason: "./lambda/createSeason/index.ts",
    getSeasonList: "./lambda/getSeasonList/index.ts",
    getContestantsBySeason: "./lambda/getContestantsBySeason/index.ts"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/index.js"
  },
  mode: "production",
  externals: {
    'aws-sdk': "require('aws-sdk')",
  }
};
