import { TableName } from '../config/tables';
import { User } from '../utils/models';
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

  const user: User = {
    username: jsonBody.username,
    firstName: jsonBody.firstName,
    lastName: jsonBody.lastName
  };

  if (!user.username || !user.firstName || !user.lastName) {
    return customError('Users require username, firstName, and lastName', callback);
  }

  ddb.putItem({
      TableName: TableName.User,
      Item: marshall(user)
    }, (err) => {
      if (err) {
        customError(err.message, callback);
      } else {
        success(JSON.stringify({ success: true }), callback);
      }
    }
  );
};
