const _ = require('lodash');
const { getLambdas } = require('./utils/build');
const path = require("path");

const lambdaFunctions = getLambdas();
// switch to a map
let entry = _.keyBy(lambdaFunctions, (fnName) => fnName);
// format the values as paths
entry = _.mapValues(entry, (fnName) => `./lambda/${fnName}.ts`);

module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        enforce: "pre",
        use: [
          {
            loader: "tslint-loader",
            options: {
              emitErrors: true
            }
          }
        ]
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
    "aws-sdk": "require('aws-sdk')"
  },
  performance: { hints: false }
};
