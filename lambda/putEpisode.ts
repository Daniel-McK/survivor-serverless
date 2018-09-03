import { TableName } from '../config/tables';
import { Episode } from '../utils/models';
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

  if (!event.pathParameters || !event.pathParameters.seasonId) {
    return customError('SeasonId required.', callback);
  }
  const seasonId = event.pathParameters.seasonId;

  const episode: Episode = {
    seasonId,
    name: jsonBody.name,
    id: jsonBody.id || event.pathParameters.episodeId,
    date: jsonBody.date
  };

  if (!episode.id || !episode.name || !episode.seasonId || !episode.date) {
    return customError('Episodes require seasonId, id, name, and date', callback);
  }

  ddb.putItem({
      TableName: TableName.Episode,
      Item: marshall(episode)
    }, (err) => {
      if (err) {
        customError(err.message, callback);
      } else {
        success(JSON.stringify({ success: true }), callback);
      }
    }
  );
};
