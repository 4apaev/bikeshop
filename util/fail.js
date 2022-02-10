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
  static trace(start = Fail.trace) {
    const ps = Error.prepareStackTrace
    Error.prepareStackTrace = (_, s) => s

    const e = new Error
    Error.captureStackTrace(e, start)

    const { stack } = e
    Error.prepareStackTrace = ps

    return stack.map(cs => ({
      file: cs.getFileName(),
      row: cs.getLineNumber(),
      col: cs.getColumnNumber(),
      fname: cs.getFunctionName(),
      // self    : cs.getThis(),
      // method  : cs.getMethodName(),
      // type    : cs.getTypeName(),
      // isCtor  : cs.isConstructor(),
      // isAsync : cs.isAsync(),
      // isNative: cs.isNative(),
    }))
  }
}

export const deny = Fail.deny
export const raise = Fail.raise
export const assert = Fail.assert

function parse(a, b) {
  return Error[ Symbol.hasInstance ](a)
    ? [ 'rethrow: ' + a.message, { cause: a }]
    : [ a, { cause: b?.cause ?? b }]
}
