import {
  ok,
  deepStrictEqual as equal,
  notDeepStrictEqual as nope,
} from 'assert'

import Log from '../util/log.js'
import * as jwt from '../wheels/jwt.js'

describe('Jwt', () => {
  it('enc/dec', () => {
    const a = 'doggo'
    const b = jwt.enc(a)
    ok(a !== b)
    ok(a === jwt.dec(b))
  })

  it('encode/decode', () => {
    const a = { type: 'doggo', name: 'shoshi' }
    const b = jwt.encode(a)
    equal(a, jwt.decode(b))
  })

  it('ok: create/verify', () => {
    const a = { type: 'dog', name: 'bob' }
    const b = jwt.create(a)
    equal(a, jwt.verify(b))
  })

  it('nope: create/verify', () => {
    nope(
      jwt.create({ type: 'cat', name: 'alice' }),
      jwt.create({ type: 'dog', name: 'bob'   }),
    )
  })

  it('sign', () => {
    const a = jwt.sign('a', 'b', 'c')
    console.log(a)
    console.log(jwt.dec(a))
  })

})
