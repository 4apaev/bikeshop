import { STATUS_CODES } from 'http'

export default class EpicFail extends Error {
  name = 'Fail'

  constructor(m, cause) {
    super(m, cause)
    Error.captureStackTrace(this, this.constructor)
    this.cause ??= cause

    if (m in STATUS_CODES)
      this.message = STATUS_CODES[ m ]
  }

  static as() {
    return Reflect.construct(this, arguments)
  }

  static raise(m, c) {
    throw this.as(m, c)
  }

  static assert(x, m) {
    x || this.raise(m, { cause: 'assert' })
  }

  static reject(x, m) {
    return Promise.reject(this.as(x, m))
  }
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
