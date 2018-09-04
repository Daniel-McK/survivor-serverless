import { TableName } from '../config/tables';
import { customError, success } from '../utils/responses';
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({
  region: 'us-east-1',
  apiVersion: '2012-08-10'
});
const { unmarshall } = AWS.DynamoDB.Converter;

exports.handler = (event, context, callback) => {
  if (!event.pathParameters || !event.pathParameters.seasonId) {
    return customError('Missing seasonId', callback);
  }
  if (!event.pathParameters.contestantId) {
    return customError('Missing contestantId', callback);
  }

  ddb.query({
      TableName: TableName.Point,
      ExpressionAttributeValues: {
        ':s': {
          S: event.pathParameters.seasonId
        },
        ':c': {
          S: `${event.pathParameters.contestantId}+`
        }
      },
      KeyConditionExpression: 'seasonId = :s and begins_with(contestantPlusId, :c)'
    },
    (err, data) => {
      if (err) {
        customError(err.message, callback);
      } else {
        success(JSON.stringify(data.Items.map(unmarshall)), callback);
      }
    }
  );
};
