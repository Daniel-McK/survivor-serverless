import { TableName } from '../config/tables';
import { PointType } from '../utils/models';
import { customError, success } from '../utils/responses';

const AWS = require('aws-sdk');

const { marshall } = AWS.DynamoDB.Converter;
const ddb = new AWS.DynamoDB({
  region: 'us-east-1',
  apiVersion: '2012-08-10'
});

exports.handler = (event, context, callback) => {
  if (!event.body) {
    return customError('Request body required.', callback);
  }

  const jsonBody = JSON.parse(event.body);

  const pointType: PointType = {
    name: jsonBody.name,
    value: jsonBody.value
  };

  if (!pointType.value || !pointType.name) {
    return customError('Point Types require name and value', callback);
  }

  ddb.putItem({
      TableName: TableName.PointType,
      Item: marshall(pointType)
    }, (err) => {
      if (err) {
        customError(err.message, callback);
      } else {
        success(JSON.stringify({ success: true }), callback);
      }
    }
  );
};
