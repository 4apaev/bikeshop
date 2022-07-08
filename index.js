import Log from './util/log.js'
import * as Config from './config/config.js'

import * as User from './service/user.js'
import * as Bike from './service/bike.js'
import * as UBike from './service/user.bikes.js'

import SSE from './wheels/sse.js'
import Router from './wheels/router.js'
import {
  echo,
  logger,
  onError,
  reqPayload,
} from './wheels/middleware.js'

import {
  send,
  statiq,
} from './wheels/middleware.static.js'

const debug = Log.debug('app')
const app = new Router

app.on('error', onError)

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
app.get('/api/healtcheck', echo)

// ////////////////////////////////////////////////// static

app.context.Config = Config

app.get(/^.app\/.*/,  send(Config.statiq.index))
app.get(/^.util\/.*/, statiq(Config.cwd))
app.get(statiq(Config.statiq.dir, Config.statiq.dict))

const server = app.listen(Config.port, () => {
  debug(`
  Server started on port %s
  CWD %s
  `, Config.port, Config.cwd)
})

export { app, server }
