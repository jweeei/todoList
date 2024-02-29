const http = require('node:http')
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')
const errHandle = require('./errHandle')
dotenv.config()

const PORT = process.env.PORT || 3080
const HEADERS = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
}
let data = []

const server = http.createServer((req, res) => {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk
  })

  if (req.url == '/' && req.method == 'GET') {
    res.writeHead(200, HEADERS)
    res.write(
      JSON.stringify({
        status: 'success',
        data,
      })
    )
    res.end()
  } else if (req.url == '/todos/' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body)?.title

        if (title == undefined) {
          errHandle(400, HEADERS, res, '欄位填寫有誤')
        } else {
          const todo = {
            id: uuidv4(),
            data: title,
          }
          data = [...data, todo]

          res.writeHead(200, HEADERS)
          res.write(
            JSON.stringify({
              status: 'success',
              data,
            })
          )
          res.end()
        }
      } catch (error) {
        errHandle(400, HEADERS, res, '欄位填寫有誤')
      }
    })
  } else if (req.url == '/' && req.method == 'OPTIONS') {
    res.writeHead(200, HEADERS)
    res.end()
  } else if (req.url == '/' && req.method == 'DELETE') {
    data.length = 0

    res.writeHead(200, HEADERS)
    res.write(
      JSON.stringify({
        status: 'success',
        data,
      })
    )
    res.end()
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop()
    const index = data.findIndex((item) => item.id == id)

    if (index !== -1) {
      data.splice(index, 1)
      res.writeHead(200, HEADERS)
      res.write(
        JSON.stringify({
          status: 'success',
          data,
        })
      )
      res.end()
    } else {
      errHandle(400, HEADERS, res, '欄位填寫有誤')
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        const id = req.url.split('/').pop()
        const index = data.findIndex((item) => item.id == id)
        const title = JSON.parse(body)?.title

        if (title !== undefined && index !== -1) {
          data[index].data = title

          res.writeHead(200, HEADERS)
          res.write(
            JSON.stringify({
              status: 'success',
              data,
            })
          )
          res.end()
        } else {
          errHandle(400, HEADERS, res, '欄位填寫有誤')
        }
      } catch (error) {
        errHandle(400, HEADERS, res, '欄位填寫有誤')
      }
    })
  } else {
    errHandle(404, HEADERS, res, 'not found')
  }
})
server.listen(PORT, () => {
  console.log(`Server running`)
})
