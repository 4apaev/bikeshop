/* eslint-disable no-unused-vars */
import {
  deepStrictEqual as equal,
  doesNotThrow,
  throws,
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

  it('is', () => {
    equal(Is(), false)
    equal(Is('Object', {}), true)
    equal(Is('Object', []), false)
    equal(Is(Object, []), true)

    doesNotThrow(_ => Is.assert(Array, []))
    throws(_ => Is.assert(Array, {}, 'epic fail'), /epic fail/)
  })

  it('is.not', () => {
    equal(Is.not(), true)
    equal(Is.not('Object', {}), false)
    equal(Is.not('Object', []), true)
    equal(Is.not(Object, []), false)

    throws(_ => Is.not.assert(Array, [], 'epic fail'), /epic fail/)
    doesNotThrow(_ => Is.not.assert(Array, {}))
  })

  it('boolean', () => {
    equal(Is.b(), false)
    equal(Is.b(null), false)
    equal(Is.b(undefined), false)

    equal(Is.b(false), true)
    equal(Is.b(true), true)

    doesNotThrow(_ => Is.assert.b(false))
    throws(_ => Is.assert.b(null), Fail)
  })

  it('not.boolean', () => {
    equal(Is.not.b(), true)
    equal(Is.not.b(null), true)
    equal(Is.not.b(undefined), true)

    equal(Is.not.b(false), false)
    equal(Is.not.b(true), false)

    doesNotThrow(_ => Is.not.assert.b())
    throws(_ => Is.not.assert.b(true), Fail)
  })

})
