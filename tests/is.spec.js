/* eslint-disable no-unused-vars */
import { format as frmt } from 'util'
import {

  throws,
  doesNotThrow  as noThrow,
  deepStrictEqual as equal,
} from 'assert'

import Is, {
  Fail,
} from '../util/is.js'

/*

O I X S
B a n i
b s f o
eq

*/

describe('Is', () => {

  function combo(method, goodArgs, badArgs, msgOk, msgNope) {
    combo.ok(method, goodArgs, msgOk)
    combo.nope(method, badArgs, msgNope)
  }

  combo.ok = (k, args, msg) => {
    Array.isArray(args) ||  (args = [].concat(args))
    msg ??= args.join(', ')

    it(`[ 1 0 ] is.${ k }: ${ msg }`, () => {
      equal(!0, Is[     k ](...args), `1: Is.${ k }( ${ msg } )`)
      equal(!1, Is.not[ k ](...args), `0: Is.${ k }.not ( ${ msg } )`)
    })

    it(`[ 1 0 ] is.${ k }.assert ${ msg }`, () => {
      noThrow(() => Is.assert[     k ](...args))
      throws(() => Is.assert.not[ k ](...args), Fail)
    })
  }

  combo.nope = (k, args, msg) => {
    args = [].concat(args)
    msg ??= args.join(', ')

    it(`[ 0 1 ] is.${ k }: ${ msg }`, () => {
      equal(!1, Is[     k ](...args), `0: Is.${ k }( ${ msg } )`)
      equal(!0, Is.not[ k ](...args), `1: Is.${ k }.not( ${ msg } )`)
    })

    it(`[ 0 1 ] is.${ k }.assert ${ msg }`, () => {
       throws(() => Is.assert[     k ](...args), Fail)
      noThrow(() => Is.assert.not[ k ](...args))
    })

    // it (`0: Is.${ k }( ${ msg } )`,     () => equal(!1, Is[     k ](...args)))
    // it (`1: Is.${ k }.not( ${ msg } )`, () => equal(!0, Is.not[ k ](...args)))
    // it (`0: throw Is.assert.${ k }( ${ msg } )`,     () =>  throws(() => Is.assert[     k ](...args), Fail))
    // it (`1: throw Is.assert.${ k }.not( ${ msg } )`, () => noThrow(() => Is.assert.not[ k ](...args)))
  }

  combo.ok.each = (k, args, ...msgs) => args.forEach((a, i) => combo.ok(k, a, msgs[ i ]))
  combo.nope.each = (k, args, ...msgs) => args.forEach((a, i) => combo.nope(k, a, msgs[ i ]))

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
    combo.ok.each('b', [ true, false ])
    combo.nope.each('b', [ 0, 1, '', null, NaN, undefined ])
  })

  describe('string', () => {
    combo.ok.each('s', [ '', `some`, String.raw`raw` ])
    combo.nope.each('s', [ 0, 1, null, NaN, undefined, {}, [[]], new String('ctor') ])
  })

  describe('function', () => {
    combo.ok.each('f', [ x => x, Function, new Function('return true') ])
    combo.nope.each('f', [ 0, 1, null, NaN, undefined, {}, [[]], new String('ctor') ])
  })

  describe('equal', () => {

    describe('primitives', () => {
      combo('eq', [  0,   0  ], [  0,   1  ])
      combo('eq', [ 'a', 'a' ], [ 'a', 'b' ])
      combo('eq', [ true, true ], [ true, false ])

      combo('eq',

        [ Symbol.for('✅'), Symbol.for('✅') ],
        [ Symbol.for('💣'), Symbol.for('🧨') ],
        'Symbol.for(✅), Symbol.for(✅)',
        'Symbol.for(💣), Symbol.for(🧨)',
      )

    })

    describe('complex', () => {
      const a = { a: { b: [ new Set('abc'), new Map([[ 1,2 ]]) ]} }
      const b = { a: { b: [ new Set('abc'), new Map([[ 1,2 ]]) ]} }
      const c = { a: { b: [ new Set('ab'),  new Map([[ 1,2 ]]) ]} }

      combo.ok('eq', [  a, b  ], '{ a: { b: [ new Set(abc), new Map([1,2]) ]} }')
      combo.nope('eq', [  a, c  ], '{ a: { b: [ new Set(ab), new Map([1,2]) ]} }')
      combo.nope('eq', [  b, c  ], '{ a: { b: [ new Set(ab), new Map([1,2]) ]} }')
    })
  })

})
