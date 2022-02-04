import { STATUS_CODES } from 'http'

export default class EpicFail extends Error {
  name = 'Fail'

  constructor(msg, cause) {
    super(...parse(msg, cause))
    Error.captureStackTrace(this, this.constructor)
  }

  set(k, v) {
    return Object.assign(this, typeof k == 'object'
      ? k
      : { [ k ]: v })
  }

  static as() {
    return Reflect.construct(this, arguments)
  }

  static assert(a, b) {
    a || this.raise(b, { cause: 'assert' })
  }

  static raise() {
    throw Reflect.construct(this, arguments)
  }

  static deny() {
    return Promise.reject(Reflect.construct(this, arguments))
  }
}

function parse(a, b) {
  [ a, b ] = Error[ Symbol.hasInstance ](a)
    ? [ 'rethrow: ' + a.message, { cause: a }]
    : [ a, { cause: b?.cause ?? b }]
  return [ a in STATUS_CODES
    ? STATUS_CODES[ a ]
    : a, b ]
}
