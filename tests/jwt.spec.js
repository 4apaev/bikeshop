/* eslint-disable no-unused-vars */
import {
  ok,
  deepStrictEqual as equal,
  notDeepStrictEqual as nope,
} from 'assert'
import * as jwt from '../wheels/jwt.js'

/*

create
verify
sign

*/
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
    const a = { type: 'doggo', name: 'shoshi' }
    const b = jwt.create(a)


    equal(a, jwt.verify(b))
  })

  it('nope: create/verify', () => {
    const a = { type: 'doggo', name: 'shoshi' }
    const b = { type: 'doggo', name: 'jacko' }

    const c = jwt.create(a)
    const d = jwt.create(b)
    nope(c, d)
  })

  it('sign', () => {
    const a = jwt.sign('a', 'b', 'c')
    console.log(a)
    console.log(jwt.dec(a))
  })

})
