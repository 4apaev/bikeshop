export default class Fail extends Error {
  name = 'Fail'

  constructor(m, c) {
    [ m, c ] = parse(m, c)
    super(m, c)
    Error.captureStackTrace(this, this.constructor)
    this.message = m
  }

  set(k, v) {
    return Object.assign(this, typeof k == 'object'
      ? k
      : { [ k ]: v })
  }

  static as = (m, c) => new this(m, c)
  static assert = (a, b) => a || this.raise(b, { cause: 'assert' })
  static raise = (m, c) => { throw this.as(m, c) }
  static deny = (m, c) => Promise.reject(this.as(m, c))
}

export const deny = Fail.deny
export const raise = Fail.raise
export const assert = Fail.assert

function parse(a, b) {
  return Error[ Symbol.hasInstance ](a)
    ? [ 'rethrow: ' + a.message, { cause: a }]
    : [ a, { cause: b?.cause ?? b }]
}
