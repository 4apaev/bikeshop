import Log from './util/log.js'
import { port } from './config/config.js'

import * as User from './service/user.js'
import * as Bike from './service/bike.js'
import * as UBike from './service/user.bikes.js'

import SSE from './wheels/sse.js'
import Router from './wheels/router.js'
import {
  echo,
  logger,
  reqPayload,
} from './wheels/middleware.js'

// import {
//   send,
//   statiq,
// } from './wheels/middleware.static.js'

const debug = Log.debug('app')
const app = new Router

/**
 * @param {number} c
 * @param {string | Error} e
 */
function deny(c, e) {
  this.status = c
  this.type = 'json'
  this.body = {
    error: true,
    message: String(e),
  }
  debug('Deny', e?.message)
}
app.context.deny = deny

app.on('error', (e, ctx) => {
  Log.error('{{{{{{ error }}}}}}', e)
  Log.error('{{{{{{ error }}}}}}', ctx)
})

// //////////////////////////////////////////////////
app.use(logger)

// //////////////////////////////////////////////// SSE
app.get('/api/stream', SSE)
// ////////////////////////////////////////////////// /api get
app.get('/api/users',      User.list)
app.get('/api/bikes',      Bike.list)
app.get('/api/user-bikes', UBike.list)

app.get(/^.api.users.(?<id>\d+)$/,               User.get)
app.get(/^.api.bikes.(?<id>\d+)$/,               Bike.get)
app.get(/^.api.user-bikes.(?<bid>\d+).(?<uid>\d+)$/, UBike.get)

// ////////////////////////////////////////////////// /api post
app.post(reqPayload)
app.post('/api/bikes',      Bike.create)
app.post('/api/users',      User.create)
app.post('/api/user-bikes', UBike.create)
app.post('/api/auth/login', User.auth)

// ////////////////////////////////////////////////// echo
app.get('/healtcheck', echo)

// ////////////////////////////////////////////////// static
const cwd = process.cwd()

// app.get(/^\/app\/.*/,    send(cwd + '/pub/index.html'))
// app.get(/^\/util\/.*/, statiq(cwd))
// app.get(statiq(cwd + '/pub', { '/': '/index.html' }))

const server = app.listen(port, () => {
  Log`
  Server started on port ${ port }
  CWD ${ cwd }
  `
})

export { app, server }
