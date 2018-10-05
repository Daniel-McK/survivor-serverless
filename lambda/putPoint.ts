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

const validationWarning = 'Points require seasonId, episodeId, pointType, and contestantId';

exports.handler = (event, context, callback) => {
  if (!event.body) {
    return customError('Request body required.', callback);
  }
  if (!event.pathParameters || !event.pathParameters.seasonId) {
    return customError('seasonId is required.', callback);
  }
  const seasonId = event.pathParameters.seasonId;

  const jsonBody = JSON.parse(event.body);

  if (jsonBody.length >= 0) {
    putPoints(jsonBody.map((obj) => buildPoint(obj, seasonId)), callback);
  } else {
    putPoint(buildPoint(jsonBody, seasonId), callback);
  }
};

function buildPoint(obj: any, seasonId: string): Point {
  return {
    seasonId,
    episodeId: obj.episodeId,
    pointType: obj.pointType,
    contestantPlusId: `${obj.contestantId}+${newUuid()}`
  };
}

function putPoint(point: Point, callback) {
  if (!isValidPoint(point)) {
    return customError(validationWarning, callback);
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
  });
}

function putPoints(points: Point[], callback) {
  if (points.some((point: Point) => !isValidPoint(point))) {
    return customError(validationWarning, callback);
  }

  ddb.batchWriteItem({
    RequestItems: {
      [TableName.Point]: points.map((point) => ({
        PutRequest: {
          Item: marshall(point)
        }
      }))
    }
  }, (err) => {
    if (err) {
      customError(err.message, callback);
    } else {
      success(JSON.stringify({ success: true }), callback);
    }
  });
}

function isValidPoint(point) {
  return point.seasonId && point.episodeId && point.pointType && point.contestantPlusId;
}
