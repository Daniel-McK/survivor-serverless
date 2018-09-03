const child_process = require("child_process");
const resolve = require('path').resolve;
const AWS = require('aws-sdk');
const fs = require('fs');
const credentials = require('./config/aws');

const lambda = new AWS.Lambda({ region: 'us-east-1', credentials });

const lambdaFunctions = [
  'getSeasonList',
  'createSeason',
  'getContestantsBySeason',
  'putContestant',
  'getEpisodesBySeason'
];

lambdaFunctions.forEach(deployLambda);

function deployLambda(lambdaName) {
  child_process.execSync(`zip -r ${lambdaName}.zip *`, {
    cwd: resolve(`./dist/${lambdaName}`)
  });
  const zipFileName = `./dist/${lambdaName}/${lambdaName}.zip`;
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
  }, (err, data) => {
    if (err) {
      console.log(`Failed to deploy ${FunctionName}: ${err}`);
    } else {
      console.log(`Deployed ${FunctionName} [${data.FunctionArn}]`);
    }
  });
}