import { Log } from './util/index.js'
import Router from './wheels/router.js'
import * as User from './service/user.js'
import * as Bike from './service/bike.js'
import * as UBike from './service/user.bikes.js'

import {
  logger,
  reqPayload,
} from './wheels/middleware.js'

import {
  send,
  statiq,
} from './wheels/middleware.static.js'

import { port } from './config/config.js'

const debug = Log.debug('app')
const app = new Router

app.use(logger)

app.get('/api/user-bikes/:uid-:bid$', UBike.get)
app.get('/api/users/:id$',            User.get)
app.get('/api/bikes/:id$',            Bike.get)

app.get('/api/user-bikes', UBike.list)
app.get('/api/users',      User.list)
app.get('/api/bikes',      Bike.list)

app.post(reqPayload)

app.post('/api/user-bikes', UBike.create)
app.post('/api/users',      User.create)
app.post('/api/bikes',      Bike.create)

// static
app.get(`/app/.*`,    send('./pub/index.html'))

app.get('/util/*', statiq())
app.get(statiq('./pub'))

app.listen(port, () => debug('Server started on port', port))
