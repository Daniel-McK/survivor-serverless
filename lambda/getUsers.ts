import { TableName } from '../config/tables';
import { customError, success } from '../utils/responses';
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({
  region: 'us-east-1',
  apiVersion: '2012-08-10'
});
const { unmarshall } = AWS.DynamoDB.Converter;

exports.handler = (event, context, callback) => {
  ddb.scan({
    TableName: TableName.User
  }, (err, data) => {
    if (err) {
      customError(err.message, callback);
    } else {
      success(JSON.stringify(data.Items.map(unmarshall)), callback);
    }
  });
};
