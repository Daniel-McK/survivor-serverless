export function customError(message, callback) {
  callback(null, {
    body: JSON.stringify({
      message
    }),
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export function success(body, callback) {
  callback(null, {
    body,
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}
