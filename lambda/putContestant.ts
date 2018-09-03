import { customError } from "../utils/errors";
import { TableName } from "../config/tables";
import { Contestant } from "../utils/models";

const AWS = require("aws-sdk");

const { marshall } = AWS.DynamoDB.Converter;
const ddb = new AWS.DynamoDB({
  region: "us-east-1",
  apiVersion: "2012-08-10"
});

exports.handler = function(event, context, callback) {
  if (!event.body) {
    return customError("Request body required.", callback);
  }

  const jsonBody = JSON.parse(event.body);

  if (!event.pathParameters || !event.pathParameters.seasonId) {
    return customError("SeasonId required.", callback);
  }
  const seasonId = event.pathParameters.seasonId;

  const contestant: Contestant = {
    seasonId,
    name: jsonBody.name,
    id: jsonBody.id || event.pathParameters.contestantId,
    imageUrl: jsonBody.imageUrl
  };

  if (!contestant.id || !contestant.name || !contestant.seasonId) {
    return customError("Contestants require seasonId, id and name", callback);
  }

  ddb.putItem(
    {
      TableName: TableName.Contestant,
      Item: marshall(contestant)
    },
    err => {
      if (err) {
        customError(err.message, callback);
      } else {
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ success: true })
        });
      }
    }
  );
};
