const child_process = require("child_process");
const resolve = require('path').resolve;
const AWS = require('aws-sdk');
const fs = require('fs');
const credentials = require('./config/aws');

const lambda = new AWS.Lambda({ region: 'us-east-1', credentials });

const lambdaFunctions = [
  'getSeasonList',
  'createSeason'
];

lambdaFunctions.forEach(deployLambda);

function deployLambda(lambdaName) {
  child_process.execSync(`zip -r code.zip *`, {
    cwd: resolve(`./lambda/${lambdaName}`)
  });
  const zipFileName = `./lambda/${lambdaName}/code.zip`;
  fs.readFile(zipFileName, (err, data) => {
    if (err) {
      console.log(`Failed to read ${zipFileName}`);
      return;
    }
    updateCode(lambdaName, data);
  });
}

function updateCode(FunctionName, ZipFile) {
  lambda.updateFunctionCode({
    FunctionName,
    ZipFile
  }, (err) => {
    if (err) {
      console.log(`Failed to deploy ${FunctionName}: ${err}`);
    } else {
      console.log(`Deployed ${FunctionName}`);
    }
  });
}