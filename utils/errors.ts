export function customError(message, callback) {
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