const µ = null

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

  static CODES = {}
  static STATUSES = {}

  static is = x => this[ Symbol.hasInstance ](x)

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
      this.code ??= e?.code ?? this?.cause?.code ?? Fail.STATUSES[ e ] ?? 0
    }
  }

  set(k, v) {
    return k
      ? Object.assign(this, typeof k == 'object'
        ? k
        : { [ k ]: v })
      : this
  }

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

export function Try(fn, ...a) {
  try {
    return [ µ, fn.apply(µ, a) ]
  }
  catch (e) {
    return [ new Fail(e?.message ?? 'Try failed', e), µ ]
  }
}

export function trace(start = trace) {
  const { prepareStackTrace } = Error
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

Fail.CODES[ 400 ] = 'Bad Request'
Fail.CODES[ 401 ] = 'Unauthorized'
Fail.CODES[ 402 ] = 'Payment Required'
Fail.CODES[ 403 ] = 'Forbidden'
Fail.CODES[ 404 ] = 'Not Found'
Fail.CODES[ 405 ] = 'Method Not Allowed'
Fail.CODES[ 406 ] = 'Not Acceptable'
Fail.CODES[ 407 ] = 'Proxy Authentication Required'
Fail.CODES[ 408 ] = 'Request Timeout'
Fail.CODES[ 409 ] = 'Conflict'
Fail.CODES[ 410 ] = 'Gone'
Fail.CODES[ 411 ] = 'Length Required'
Fail.CODES[ 412 ] = 'Precondition Failed'
Fail.CODES[ 413 ] = 'Payload Too Large'
Fail.CODES[ 414 ] = 'URI Too Long'
Fail.CODES[ 415 ] = 'Unsupported Media Type'
Fail.CODES[ 416 ] = 'Range Not Satisfiable'
Fail.CODES[ 417 ] = 'Expectation Failed'
Fail.CODES[ 418 ] = `I'm a Teapot`
Fail.CODES[ 421 ] = 'Misdirected Request'
Fail.CODES[ 422 ] = 'Unprocessable Entity'
Fail.CODES[ 423 ] = 'Locked'
Fail.CODES[ 424 ] = 'Failed Dependency'
Fail.CODES[ 425 ] = 'Too Early'
Fail.CODES[ 426 ] = 'Upgrade Required'
Fail.CODES[ 428 ] = 'Precondition Required'
Fail.CODES[ 429 ] = 'Too Many Requests'
Fail.CODES[ 431 ] = 'Request Header Fields Too Large'
Fail.CODES[ 451 ] = 'Unavailable For Legal Reasons'
Fail.CODES[ 500 ] = 'Internal Server Error'
Fail.CODES[ 501 ] = 'Not Implemented'
Fail.CODES[ 502 ] = 'Bad Gateway'
Fail.CODES[ 503 ] = 'Service Unavailable'
Fail.CODES[ 504 ] = 'Gateway Timeout'
Fail.CODES[ 505 ] = 'HTTP Version Not Supported'
Fail.CODES[ 506 ] = 'Variant Also Negotiates'
Fail.CODES[ 507 ] = 'Insufficient Storage'
Fail.CODES[ 508 ] = 'Loop Detected'
Fail.CODES[ 509 ] = 'Bandwidth Limit Exceeded'
Fail.CODES[ 510 ] = 'Not Extended'
Fail.CODES[ 511 ] = 'Network Authentication Required'

Object.assign(Fail.STATUSES,
  Object.fromEntries(
    Object.entries(Fail.CODES)
        .map(([ k, v ]) =>
          [ v, k ])))

