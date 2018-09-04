import { TableName } from '../config/tables';
import { Point } from '../utils/models';
import { customError, success } from '../utils/responses';

const { newUuid } = require('../utils/ids');
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
  if (!event.pathParameters || !event.pathParameters.seasonId) {
    return customError('seasonId is required.', callback);
  }

  const jsonBody = JSON.parse(event.body);

  const point: Point = {
    seasonId: event.pathParameters.seasonId,
    episodeId: jsonBody.episodeId,
    pointType: jsonBody.pointType,
    contestantPlusId: `${jsonBody.contestantId}+${newUuid()}`
  };

  if (!point.seasonId || !point.episodeId || !point.pointType || !point.contestantPlusId) {
    return customError('Points require seasonId, episodeId, pointType, and contestantId', callback);
  }

  ddb.putItem({
      TableName: TableName.Point,
      Item: marshall(point)
    }, (err) => {
      if (err) {
        customError(err.message, callback);
      } else {
        success(JSON.stringify({ success: true }), callback);
      }
    }
  );
};
