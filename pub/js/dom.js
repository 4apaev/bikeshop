import O from '/util/define.js'
import is from '/util/is.js'

const µ = null
const A = Array
const E = new WeakMap
const STOP = Symbol('📛')
const doc = document

is.use('node', x => Node[ Symbol.hasInstance ](x))

export default function JQ(q, el = doc, cb) {
  if (is.f(el))
    cb = el, el = doc
  return /^\++/.test(q) || is.f(cb)
    ? A.from(el.querySelectorAll(q.replace(/^\++/, '')), cb)
    : el.querySelector(q)
}

O.use(JQ, {
  get frag() {
    return doc.createDocumentFragment()
  },

  stop(e) {
    e.stopImmediatePropagation()
    e.stopPropagation()
    e.preventDefault()
  },

  getEvents(x) {
    return E.get(x)
  },

  text() { return doc.createTextNode.apply(doc, arguments) },
  attr() { return doc.createAttribute.apply(doc, arguments) },
  comment() { return doc.createComment.apply(doc, arguments) },

  create(name, props, ...children) {
    const el = doc.createElement(name)
    if (props) {
      if (is.O(props))
        el.attr(props)
      else
        el.append(props)
    }
    el.append(...children)
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

O.alias(Node.prototype, 'textContent', 'text')
O.alias(Node.prototype, 'parentElement', 'parent')

O.alias(Element.prototype, 'classList', 'cls')
O.alias(Element.prototype, 'hasAttribute', 'has')
O.alias(Element.prototype, 'getAttribute', 'get')
O.alias(Element.prototype, 'toggleAttribute', 'toggle')
O.alias(Element.prototype, 'querySelector', 'find')
O.alias(Element.prototype, 'lastElementChild', 'last')
O.alias(Element.prototype, 'firstElementChild', 'first')
O.alias(Element.prototype, 'nextElementSibling', 'next')
O.alias(Element.prototype, 'previousElementSibling', 'prev')

O.use(Element.prototype, {
  $(s, cb) {
    return cb
      ? A.from(this.querySelectorAll(s), cb)
      : this.querySelector(s)
  },

  html(s, ...a) {
    if (s == µ)
      return this.innerHTML

    if (a.length) { // eslint-disable-next-line no-var
      for (var i = 0, re = [ s.raw[ 0 ] ]; i < a.length;)
        re = re.concat(a[ i++ ], s.raw[ i ])
      s = re.join('')
    }
    return this.empty().insert(s.trim())
  },

  empty(cb = x => x) {
    while (this.first)
      this.removeChild(cb(this.first.off()))

    while (this.firstChild)
      this.removeChild(this.firstChild)
    return this
  },

  insert(x, pos = 'beforeEnd') {
    this[ x instanceof Element
      ? 'insertAdjacentElement'
      : 'insertAdjacentHTML' ](pos, x)
    return this
  },

  set(k, v) {
    if (is.b(v ??= false))
      return this.toggleAttribute(k, v)
    this.setAttribute(k, v)
    return this
  },

  attr(k, v) {
    const i = arguments.length
    if (i === 0) {
      return O.too(A.from(this.attributes, a => [ a.name, a.value === ''
        ? true
        : a.value ]))
    }

    if (i === 1) {
      if (is.o(k)) {
        for (const [ a, b ] of O.entries(k))
          this.set(a, b)
        return this
      }
      return this.getAttribute(k)
    }
    return this.set(k, v)
  },

  on(ch, query, cb) {
    is.f(query) && ([ query, cb ] = [ cb, query  ])

    const listener = query
      ? e => e.target.matches(query) && STOP === cb(e, STOP) && JQ.stop(e)
      : e => STOP === cb(e, STOP) && JQ.stop(e)

    const off = (a, b) => {
      if ((!a || a === ch) && (!b || b === cb)) {
        this.removeEventListener(ch, listener)
        return true
      }
      return false
    }

    E.get(this)?.push?.(off) ?? E.set(this, [ off ])
    this.addEventListener(ch, listener)
    return this
  },

  off(e, cb) {
    const it = E.get(this)
    if (it == µ) return this
    let j = 0

    if (is.f(e))
      cb = e, e = null

    for (let i = 0; i < it.length; i++) {
      if (!it[ i ](e, cb))
        it[ j++ ] = it[ i ]
    }
    it.length = j
    j === 0 && E.delete(this)
    return this
  },

  emit(e, detail = {}) {
    const ce = new CustomEvent(e, {
      detail,
      bubbles: true,
      cancelable: true,
    })
    this.dispatchEvent(ce)
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

