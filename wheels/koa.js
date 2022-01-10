/* eslint-disable no-unused-vars */

import { Log } from '../util/index.js'
import Router from './router.js'
import * as User from '../service/user.js'
import * as Bike from '../service/bike.js'


import {
  logger,
  reqPayload,
} from './middleware.js'

import {
  send,
  statiq,
} from './middleware.static.js'

import { port } from '../config/config.js'

const debug = Log.debug('app')
const app = new Router

app.use(logger)

app.get(/\/api\/user/, User.get)
app.get(/\/api\/bike/, Bike.get)

app.get('/Sync.js', send('./node_modules/sync/src/Fetch.js'))
app.get('/Base.js', send('./node_modules/sync/src/Base.js'))
app.get('/Mim.js', send('./node_modules/sync/src/Mim.js'))
app.get('/define.js', send('./util/define.js'))

app.get(statiq('./pub'))

app.post(reqPayload)
app.post('/api/user/auth', User.auth)
app.post('/api/user', User.create)
app.post('/api/bike', Bike.create)





app.listen(port, () => debug('Server started on port', port))

