import {
  ok,
  deepStrictEqual as equal,
} from 'assert'

import Sync from 'sync/src/Sync.js'
import Is from '../util/is.js'
import { server } from  '../index.js'
import Query from '../db/db.js'


const { log } = console

const route = '/api/users'

describe('API:Users', () => {

  before(async () => {
    await Query('TRUNCATE users CASCADE;')
    // await Query(`insert into users (uname, email, pass) values ('krote', 'krote@shoshi.dog', crypt('123', gen_salt('bf', 8)))`)
  })

  after(done => {
    server.close(async () => {
      await Query('TRUNCATE users CASCADE;')
      log('============== END =================')
      done()
    })
  })

  describe('GET', () => {
    it(route, async () => {
      const re = await Sync.get(route)
      equal(true, re.ok)
      equal(200, re.code)
      Is.assert.a(re.body, 'body.value should be an Array')
    })

    // it(route + '/1', async () => {
    //   const re = await Sync.get(route + '/1')
    //   equal(true, re.ok)
    //   equal(200, re.code)
    //   equal({
    //     id: 1,
    //     uname: 'krote',
    //     email: 'krote@shoshi.dog',
    //   }, re.body)
    // })
  })

  describe('POST', () => {
    it(route, async () => {
      const re = await Sync.post(route, {
        id: 1,
        uname: 'krote',
        email: 'krote@shoshi.dog',
      })
      equal(true, re.ok)
      equal(200, re.code)
      log(re.body)
    })
  })
})
