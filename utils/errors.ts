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
