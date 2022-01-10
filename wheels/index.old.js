/* eslint-disable no-unused-vars */

import Fs from 'fs'
import App from './app.js'
import { Log } from '../util/index.js'
import {
  logger,
  statiq,
  favicon,
  reqPayload,
} from './middleware.js'

const debug = Log.debug('wheels')
const app = new App

const path = process.cwd()

app.use(logger)
// app.use(reqPayload)

app.get('/favicon.ico', favicon)

const fileServer = statiq(path + '/pub', {
  '/': '/index.html',
})

app.get(fileServer)
// app.use(async (ctx, next) => {
//   if (ctx.method == 'GET')
//     await fileServer(ctx)
//   else
//     next()
// })

/*
app.get('/', ctx => {
  ctx.type = 'html'
  ctx.body = Fs.createReadStream(path + '/pub/index.html')
})



app.get('/main.css', ctx => {
  ctx.type = 'css'
  ctx.body = Fs.createReadStream(path + '/pub/main.css')
})

app.get('/dom.js', ctx => {
  ctx.type = 'js'
  ctx.body = Fs.createReadStream(path + '/pub/dom.js')
})

app.get('/util/define.js', ctx => {
  ctx.type = 'js'
  ctx.body = Fs.createReadStream(path + '/util/define.js')
})

 */



const { PORT = 3000 } = process.env
app.listen(PORT, () => Log('Server started on port', PORT))


