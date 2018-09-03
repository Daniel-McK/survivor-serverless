const fs = require('fs');

const LAMBDA_FOLDER = './lambda/';
const LAMBDA_PATTERN = /.*\.ts/;

function getLambdas() {
  let files = fs.readdirSync(LAMBDA_FOLDER);
  // ignore non-typescript files
  files = files.filter((file) => LAMBDA_PATTERN.test(file));
  // strip off suffix
  return files.map((file) => file.split('.')[0]);
}

module.exports = {
  getLambdas
};
