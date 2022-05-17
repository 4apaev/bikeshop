import Is from '/util/is.js'
import use, {
  assign,
  alias,
  each,
} from '/util/define.js'

const µ = null
const A = Array
const O = Object
const S = String
const EVT = new WeakMap
const doc = document

Is.use('node', x => Node[ Symbol.hasInstance ](x))

export function camel2snake(s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([a-z])/g, '$1-$2')
}

export default function JQ(q, el = doc, cb) {
  Is(Node, el) || (cb = el, el = doc)
  return cb ?? /^\++/.test(q)
    ? A.from(el.querySelectorAll(q.replace(/^\++/, '')), Is.s(cb)
      ? x => x[ cb ] ?? x
      : cb)
    : el.querySelector(q)
}

use(JQ, {
  get EVT() {
    return EVT
  },
  get frag() {
    return doc.createDocumentFragment()
  },
  text()     {
    return doc.createTextNode.apply(doc, arguments)
  },
  stop(e)    {
    return e.preventDefault(e.stopPropagation(e.stopImmediatePropagation()))
  },
  create(tag, o, ...ch) {
    const el = doc.createElement(tag)
    o != µ && (o?.constructor === O ? el.attr(o) : el.append(o))
    el.append(...ch)
    return el
  },
  ico(id, width = 64, heigth = width) {
    JQ.svg({ width, heigth },
      JQ.create('use', {
        href: '/img/icons.svg#' + id,
      }))
    // return JQ.create('embed', O.assign({ src }, attr))
  },
})

alias(Node.prototype, 'textContent', 'text')
alias(Node.prototype, 'parentElement', 'parent')
alias(Element.prototype, 'classList', 'cls', 'clas', 'clss')
alias(Element.prototype, 'hasAttribute', 'has')
alias(Element.prototype, 'toggleAttribute', 'toggle')
alias(Element.prototype, 'querySelector', 'find')
alias(Element.prototype, 'lastElementChild', 'last')
alias(Element.prototype, 'firstElementChild', 'first')
alias(Element.prototype, 'nextElementSibling', 'next')
alias(Element.prototype, 'previousElementSibling', 'prev')

use(Element.prototype, {
  $(s, cb) {
    return JQ(s, this, cb)
  },
  html(s) {
    return s == µ
      ? this.innerHTML
      : this.empty().insert(s?.raw ? S.raw.apply(S, arguments) : s)
  },
  empty() {
    while (this.firstChild)
      this.removeChild(this.firstChild?.off?.() ?? this.firstChild)
    return this
  },

  insert(x, pos = 'beforeEnd') {
    this[ x instanceof Element
      ? 'insertAdjacentElement'
      : 'insertAdjacentHTML' ](pos, x)
    return this
  },

  get(k) {
    const v = this.getAttribute(k)
    return v === '' ? true : v
  },

  set(k, v) {
    if (v == µ || Is(Boolean, v))
      return this.toggle(k, !!v)
    if (k == 'cls' || k == 'clss' || k.startsWith('clas'))
      A.isArray(v) || Is(S, v) ? this.clas.add(...[ v ].concat(v)) : each.kv(v, this.clas.toggle, this.clas)
    else if (Is.o(v))
      Is.o(this[ k ]) ? assign(this[ k ], v) : this[ k ] = v
    else
      this.setAttribute(k, v)
    return this
  },

  attr(k, v) {
    const i = arguments.length
    return i === 0
      ? use.from(A.from(this.attributes, a => [ a.name,  this.get(a.name) ]))
      : i === 1
        ? Is.o(k)
          ? each.kv(k, this.set, this)
          : this.get(k)
        : this.set(k, v)
  },

  on(ch, query, cb) {
    Is.f(query) && ([ query, cb ] = [ cb, query  ])

    const listener = query
      ? e => e.target.matches(query)
          && cb(e, e.target)
      : e => cb(e, e.target)

    const off = (a, b) => {
      if ((!a || a === ch) && (!b || b === cb)) {
        this.removeEventListener(ch, listener)
        return true
      }
      return false
    }

    EVT.get(this)?.push?.(off) ?? EVT.set(this, [ off ])
    this.addEventListener(ch, listener)
    return this
  },

  off(e, cb) {
    const it = EVT.get(this)
    if (it == µ) return this

    Is.f(e) && (cb = e, e = µ)

    let j = 0
    for (let i = 0; i < it.length; i++)
      it[ i ](e, cb) || (it[ j++ ] = it[ i ])

    it.length = j
    j === 0 && EVT.delete(this)
    return this
  },

  emit(e, detail = O.o) {
    this.dispatchEvent(use(new CustomEvent(e, {
      detail,
      bubbles: true,
      cancelable: true,
    }), 0, 0, 0, {
      target: this,
      currentTarget: this,
    }))
    return this
  },
})

for (let t of `
script  link style br hr div nav ol ul li
dl dt dd table col colgroup caption tr td
th thead tbody tfoot main header aside h1
h2 h3 footer hgroup h4 h5 h6 article p i q
b u s em span pre code del dfn ins kbd mark
samp section abbr acronym time address cite
blockquote sub sup big small strong  strike
figure figcaption  audio video  picture img
svg textarea canvas a button dialog details
summary form data datalist  fieldset legend
label input  output meter  select optgroup
option       progress                  use
`.match(/\S+/g))
  JQ[ t ] = JQ.create.bind(µ, t)

