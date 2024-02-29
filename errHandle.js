const errHandle = (statusCode, HEADERS, res, message) => {
  switch (statusCode) {
    case 400:
      res.writeHead(statusCode, HEADERS)
      res.write(
        JSON.stringify({
          status: 'fail',
          message,
        })
      )
      res.end()
      break
    case 404:
      res.writeHead(statusCode, HEADERS)
      res.write(message)
      res.end()
      break
    default:
      res.writeHead(500, HEADERS)
      res.write('Internal Server Error')
      res.end()
      break
  }
}

module.exports = errHandle
