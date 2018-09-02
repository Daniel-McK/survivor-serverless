import { customError } from '../../utils/errors';
import { TableName } from '../../config/tables';
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({
  region: "us-east-1",
  apiVersion: "2012-08-10"
});
const { unmarshall } = AWS.DynamoDB.Converter;

exports.handler = function(event, context, callback) {
  if (!event.pathParameters || !event.pathParameters.seasonId) {
    return customError('Missing seasonId', callback);
  }

  ddb.query({
    TableName: TableName.Contestant,
    ExpressionAttributeValues: {
      ":s": {
        S: event.pathParameters.seasonId
       }
     },
     KeyConditionExpression: "seasonId = :s",

  }, (err, data) => {
    if (err) {
      customError(err.message, callback);
    } else {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(data.Items.map(unmarshall))
      });
    }
  });
};
