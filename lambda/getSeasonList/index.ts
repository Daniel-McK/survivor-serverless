import { customError } from '../../utils/errors';
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({
  region: "us-east-1",
  apiVersion: "2012-08-10"
});


exports.handler = function(event, context, callback) {
  ddb.scan({
    TableName: 'Season'
  }, (err, data) => {
    if (err) {
      customError(err.message, callback);
    } else {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(data.Items)
      });
    }
  });
};
