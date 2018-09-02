import { customError } from "../../utils/errors";

const AWS = require("aws-sdk");

const { marshall } = AWS.DynamoDB.Converter;
const ddb = new AWS.DynamoDB({
  region: "us-east-1",
  apiVersion: "2012-08-10"
});

exports.handler = function(event, context, callback) {

  let existingId = null;
  let name = null;
  if (event.body) {
    const jsonBody = JSON.parse(event.body);
    name = jsonBody.name;
    existingId = jsonBody.seasonId;
  }
  if (event.pathParameters && event.pathParameters.seasonId) {
    existingId = event.pathParameters.seasonId;
  }

  const season = {
    seasonId: existingId,
    name
  };

  if (!season.seasonId || !season.name) {
    return customError("Seasons require a seasonId and name", callback);
  }

  ddb.putItem(
    {
      TableName: "Season",
      Item: marshall(season)
    },
    err => {
      if (err) {
        customError(err.message, callback)
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
