/* eslint-disable no-unused-vars */

import Http from 'http'

export default Http.createServer(handler)

async function handlerFunc(rq, rs) {

  rq.setEncoding('utf8')
  rs.setHeader('content-type', 'application/json')



  const url = new URL(rq.url)

  const { accept = '*/*' } = rq.headers
  const status = +url.searchParams.get('status') ?? 200

  if (url.pathname.startsWith('/fail'))
    rs.statusCode = 500
  else
    rs.statusCode = 200

  let body = ''
  for await (const chunk of rq)
    body += chunk.toString()

  if (body.length) {
    try {
      body = JSON.parse(body)
    }
    catch (e) {
      console.error('Test Server', e.message)
    }
  }


  rs.end(JSON.stringify({
    body,
    url: rq.url,
    method: rq.method,
    headers: rq.headers,
  }, null, 2))
}




export async function handler(rq, rs) {

  rq.setEncoding('utf8')
  rs.setHeader('content-type', 'application/json')

  if (rq.url === '/json-fail') {
    rs.statusCode = 500
    return rs.end('<fail>')
  }

  rs.statusCode = 200
  let body = ''
  for await (const chunk of rq)
    body += chunk.toString()

  if (body.length) {
    try {
      body = JSON.parse(body)
    }
    catch (e) {
      console.error('Test Server', e.message)
    }
  }


  rs.end(JSON.stringify({
    body,
    url: rq.url,
    method: rq.method,
    headers: rq.headers,
  }, null, 2))
}
