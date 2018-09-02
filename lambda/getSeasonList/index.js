'use strict';

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ region: 'us-east-1', apiVersion: '2012-08-10' });

exports.handler = function(event, context, callback) {
  console.log("request: " + JSON.stringify(event));

  ddb.scan({
    TableName: 'Season'
  }, (err, data) => {
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
        body: JSON.stringify(data.Items)
      });
    }
  });
};
