/* eslint-disable no-unused-vars */
import {
  format,
  inspect,
} from 'util'
import {

  throws,
  doesNotThrow  as noThrow,
  deepStrictEqual as equal,
} from 'assert'

import Is, {
  Fail,
} from '../util/is.js'

/*
❎❎❎❎❎❎❎
✖ O  : 🚩
✖ I  : 🚩
✖ X  : 🚩
✖ S  : 🚩
✖ B  : 🚩

✚ eq : ✅
✚ b  : ✅
✚ s  : ✅
✚ f  : ✅
✖ n  : 🚩

✖ a  : 🚩
✖ i  : 🚩
✖ o  : 🚩

*/

describe('Is', () => {
  function Yep(k, args, msg) {
    Array.isArray(args) ||  (args = [].concat(args))
    msg ??= args.join(', ')

    let ttl =  `10: is.${ k }        `
    let ttla = `10: is.${ k }.assert `

    ttl
    it(ttl + msg, () => {
      equal(true , Is[     k ](...args), `✅: equal should be true`)
      equal(false, Is.not[ k ](...args), `🚩: not equal should be false`)
    })

    it(ttla + msg, () => {
      noThrow(() => Is.assert[    k ](...args))
      throws(() => Is.assert.not[ k ](...args), Fail)
    })
  }

  function Nope(k, args, msg) {
    Array.isArray(args) ||  (args = [].concat(args))
    msg ??= args.map(x => inspect(x)).join(', ')

    let ttl =  `01: is.${ k }        `
    let ttla = `01: is.${ k }.assert `

    it(ttl + msg, () => {
      equal(false, Is[     k ](...args), `🚩:     equal should be false`)
      equal(true , Is.not[ k ](...args), `✅: not equal should be true`)
    })

    it(ttla + msg, () => {
       throws(() => Is.assert[     k ](...args), Fail)  // asrt  nope 1
      noThrow(() => Is.assert.not[ k ](...args))        // asrt  nope 2
    })
  }

  function Each(I, k, args, msgs = []) {
    const fn = [ Nope, Yep ][ I ]
    for (const [ i,  a ] of args.entries())
      fn(k, a, msgs[ i ])
  }

  it('is', () => {
    equal(Is(), false)
    equal(Is('Object', {}), true)
    equal(Is('Object', []), false)
    equal(Is(Object, []), true)

    noThrow(_ => Is.assert(Array, []))
    throws(_ => Is.assert(Array, {}, 'epic fail'), /epic fail/)
  })

  it('is.not', () => {
    equal(Is.not(), true)
    equal(Is.not('Object', {}), false)
    equal(Is.not('Object', []), true)
    equal(Is.not(Object, []), false)

    throws(_ => Is.not.assert(Array, [], 'epic fail'), /epic fail/)
    noThrow(_ => Is.not.assert(Array, {}))
  })

  describe('boolean', () => {
    Each(1, 'b', [ true, false ])
    Each(0, 'b', [ 0, 1, '', null, NaN, undefined ])
  })

  describe('string', () => {
    Each(1, 's', [ '', `some`, String.raw`\/\*\*[\s\S]+?\*\*\/` ])
    Each(0, 's', [ 0, 1, null, /\/\*\*[\s\S]+?\*\*\//g, NaN, undefined, {}, [[]], new String('String'), new Set('String') ])
  })

  describe('number', () => {
    Each(1, 'n', [
      0, -0,
      1, -1,
      0xa,  -0x14,
      0o12,  -0o24,
      0b1010,  -0b10100,
      3.1416e+0, -3.1416e+0,
      3.141592653589793, -3.141592653589793,
    ])

    Each(0, 'n', [
      , '',
      [[ 1 ]], { 0: 0 },
      x => 0,
      false, true,
      null, undefined,
      '0', '-0',
      '1', '-1',
      '0xa',  '-0x14',
      '0o12',  '-0o24',
      '0b1010',  '-0b10100',
      '3.1416e+0', '-3.1416e+0',
      '3.141592653589793', '-3.141592653589793',
    ])
  })

  describe('function', () => {
    Each(1, 'f', [ x => x, Function, new Function('return true') ])
    Each(0, 'f', [ 0, 1, null, NaN, undefined, [{}], {a: [] }, new Set('qwerty') ])
  })

  describe('equal', () => {
    describe('primitives', () => {
      const on = Symbol('⏻')
      const plus = Symbol.for('✚')
      Yep('eq', [  0,   0                 ], ' 0 === 0')
      Yep('eq', [  'a',   'a'             ], ' a === a')
      Yep('eq', [  true,   true           ], ' true === true')
      Yep('eq', [  plus, Symbol.for('✚')  ], ' Symbol.for(✚) === Symbol.for(✚)')
      Yep('eq', [  on, on                 ], ' Symbol(⏻) === Symbol(⏻)')

      Nope('eq', [  0,   1            ], ' 0 !== 1')
      Nope('eq', [  'a',   'b'        ], ' a !== b')
      Nope('eq', [  true,   false     ], ' true !== false')
      // Nope('eq', [  on,   Symbol('⏻') ], ' Symbol(⏻) !== Symbol(⏻)')
    })


    describe('complex', () => {
      const a = { a: { b: [ new Set('ab'),  new Map([[ 1,2 ]]) ]} }
      const b = { a: { b: [ new Set('abc'), new Map([[ 1,2 ]]) ]} }
      const c = { a: { b: [ new Set('abc'), new Map([[ 1,2 ]]) ]} }

      const r = /\/\*\*[\s\S]+?\*\*\//g
      const d = new Date(1492, 2, 4)

      Nope('eq', [  a, b  ])
      Nope('eq', [  a, c  ])
       Yep('eq', [  b, c  ])

       Yep('eq', [  r, new RegExp(r.source, r.flags)  ])
       Yep('eq', [  d, new Date(d)  ])
    })


  })

})
