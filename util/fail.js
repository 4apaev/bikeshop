const µ = null

/**
 * @extends {Error}
 * implements {Error}
 */
export default class Fail extends Error {
  /** @type {any}    */ cause
  /** @type {number} */ code = 0
  /** @type {string} */ message = 'Epic Fail'
  /** @type {string} */ name = 'Fail'

  static /** @type {{ [ k: number]: string }} */ CODES = {}
  static /** @type {{ [ k: string]: number }} */ STATUSES = {}

  constructor(e, c) {
    super()
    Error.captureStackTrace(this, this.constructor)
    if (Error[ Symbol.hasInstance ](e)) {
      this.message = 'rethrow: ' + e.message
      this.cause = e.cause ?? e
      this.stack += '\n\n' + e.stack
      this.code ??= this.cause?.code ?? Fail.STATUSES[ e.message ] ?? 0
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
    return Object.assign(this, Object(k) === k
      ? k
      : { [ k ]: v })
  }

  static as = (m, c) => Reflect.construct(this, [ m, c ])
  static is = x => this[ Symbol.hasInstance ](x)

  static deny = (m, c) => Promise.reject(this.as(m, c))
  static assert = (x, m) => x || this.raise(m)
  static raise = (m, c) => {
    throw this.as(m, c)
  }

  static Try(fn, ...a) {
    try {
      return [ µ, fn.apply(µ, a) ]
    }
    catch (e) {
      return [ this.as(e?.message ?? 'Try failed', e), µ ]
    }
  }

  static trace = start => {
    const prepare = Error.prepareStackTrace
    Error.prepareStackTrace = (_, s) => s

    const e = new Error
    Error.captureStackTrace(e, start ?? this.trace)

    const { stack } = e
    Error.prepareStackTrace = prepare
    return stack.map(cs => ({
      // cs, x,
      file: cs.getFileName(),
      name: cs.getFunctionName(),
      type: cs.getTypeName(),
      row: cs.getLineNumber(),
      col: cs.getColumnNumber(),

    }))
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

