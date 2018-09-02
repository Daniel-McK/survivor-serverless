"use strict";

const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ region: "us-east-1", apiVersion: "2012-08-10" });

const { marshall, unmarshall } = AWS.DynamoDB.Converter;

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
    return customError('Seasons require a seasonId and name', callback);
  }

  ddb.putItem(
    {
      TableName: "Season",
      Item: marshall(season)
    },
    err => {
      if (err) {
        callback(null, {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(err)
        });
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

function customError(message, callback) {
  callback(null, {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message
    })
  });
}
