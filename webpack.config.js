const path = require("path");

module.exports = {
  entry: {
    createSeason: "./lambda/createSeason.ts",
    getSeasonList: "./lambda/getSeasonList.ts",
    getContestantsBySeason: "./lambda/getContestantsBySeason.ts",
    putContestant: "./lambda/putContestant.ts"
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
