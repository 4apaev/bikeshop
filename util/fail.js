import { CODES, STATUSES } from './fail.code.js'

const µ = undefined
const { assign } = Object
const { prepareStackTrace } = Error

export default class Fail extends Error {
  code
  cause
  message = 'Epic Fail'
  name = 'Fail'

  static as = as
  static Try = Try
  static deny = deny
  static trace = trace
  static raise = raise
  static assert = assert

  static CODES = CODES
  static STATUSES = STATUSES

  constructor(e, c) {
    super()
    Error.captureStackTrace(this, this.constructor)
    if (Error[ Symbol.hasInstance ](e)) {
      this.message = 'rethrow: ' + e.message
      this.cause = e.cause ?? e
      this.stack += '\n\n' + e.stack
    }
    else if (e) {
      this.message = e in Fail.CODES
        ? Fail.CODES[ this.code = e ]
        : e
      this.cause = c?.cause ?? c
      this.code ??= e?.code ?? this?.cause?.code ?? STATUSES[ e ] ?? 0
    }
  }

  set(k, v) {
    return k
      ? assign(this, typeof k == 'object'
        ? k
        : { [ k ]: v })
      : this
  }

  static is = x => this[ Symbol.hasInstance ](x)

}

export function as(m, c) {
  return new Fail(m, c)
}

export function deny(m, c) {
  return Promise.reject(new Fail(m, c))
}

export function raise(m, c) {
  throw new Fail(m, c)
}

export function assert(x, m) {
  x || raise(m, 'assertation failed')
}

function Try(fn, ...a) {
  try {
    return [ µ, fn.apply(µ, a) ]
  }
  catch (e) {
    return [ new Fail(e?.message ?? 'Try failed', e), µ ]
  }
}

export function trace(start = trace) {
  Error.prepareStackTrace = callSite // (_, cs) => cs

  const e = new Error
  Error.captureStackTrace(e, start)

  const { stack } = e
  Error.prepareStackTrace = prepareStackTrace
  return stack // .map(callSite)
}

function callSite(_, cs) {
  return {                         // eslint-disable-next-line key-spacing
    file  : cs.getFileName(),      // eslint-disable-next-line key-spacing
    row   : cs.getLineNumber(),    // eslint-disable-next-line key-spacing
    col   : cs.getColumnNumber(),  // eslint-disable-next-line key-spacing
    fname : cs.getFunctionName(),  // eslint-disable-next-line key-spacing
    type  : cs.getTypeName(),
  }
}

