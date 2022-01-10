import { STATUS_CODES as CODES } from 'http'
import { isNativeError } from 'util/types'

const { assign } = Object
const { construct: Ctor } = Reflect

export default class Fail extends Error {

  name = 'Fail'

  constructor(...a) {
    const { msg, ...opt } = parse(a)
    super(msg, opt)

    Error.captureStackTrace(this, this.constructor)
    this.opt = opt
    this.message = msg
  }

  get code() {
    return this.opt.code
  }

  toString() {
    return [ this.code + ':' + this.name, this.message, this.stack ].join('\n')
  }

  static as() {
    return Ctor(this, arguments)
  }

  static throws() {
    throw Ctor(this, arguments)
  }

  static reject() {
    return Promise.reject(Ctor(this, arguments))
  }
}

export class HTTPFail extends Fail {
  name = 'HTTPFail'
}

function parse(it) {
  let cause
  let code
  let msg
  let opt = {}
  for (const a of it) {
    let t = typeof a
    if (a instanceof Error || isNativeError(a))
      cause = a
    else if (t == 'object')
      assign(opt, a)
    else if (t == 'string')
      msg ??= a
    else if (t == 'number')
      code ??= a
  }

  code ??= opt.code ?? cause?.code ?? 418
  msg ??= CODES[ code ] ?? 'Epic Fail'
  return assign({ msg, code, cause }, opt)
}


/*
  600   Epic Fail
  418   I'm a Teapot

  410   Gone

  409   Conflict
  403   Forbidden

  400   Bad Request
  502   Bad Gateway

  401   Unauthorized
  415   Unsupported Media Type
  503   Unavailable Service
  451   Unavailable For Legal Reasons
  507   Insufficient Storage

  404   Not Found
  406   Not Acceptable
  405   Not Allowed Method
  416   Not Satisfiable Range
  510   Not Extended
  501   Not Implemented
  505   Not Supported HTTP Version

  webdav 423   Locked
  webdav 421   Misdirected Request
  webdav 424   Failed Dependency
  webdav 422   Unprocessable Entity

  411   Required Length
  426   Required Upgrade
  402   Required Payment
  428   Required Precondition
  407   Required Authentication Proxy
  511   Required Authentication Network

  408   Timeout Request
  504   Timeout Gateway

  417   Failed Expectation
  412   Failed Precondition

  425   Too Early
  414   Too Long URI
  429   Too Many Requests
  413   Too Large Payload
  431   Too Large Request Header Fields

  500   Internal Server Error
  506   Variant Also Negotiates

  508   Loop Detected
  509   Bandwidth Limit Exceeded
*/
