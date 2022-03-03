import $ from '/js/dom.js'

export function push(path, data) {
  history.pushState(data, data?.title, path)
}

const Seen = new Set

export default class Router extends HTMLElement {
  #view
  output = this.$('ws-output')

  get cuurent() {
    return new URL(location.pathname, location.origin)
  }

  connectedCallback() {
    this.on('click', 'a[route]', this.listen)
    this.go(this.cuurent)
    // addEventListener('popstate', this.go)
  }

  disconnectedCallback() {
    this.off('click', this.listen)
    // removeEventListener('popstate', this.go)
  }

  go = async (url = this.cuurent) => {
    const route = this.$(`ws-route[path="${ url.pathname }"]`)
      ?? this.$('ws-route[path="/app/*"]')

    const attr = route.attr()
    if (url?.searchParams) {
      Object.assign(attr,
        Object.fromEntries(url.searchParams))
    }

    if (attr.src && !Seen.has(attr.src))
      await import(attr.src)

    const view = $.create(route.get('comp'), attr)
    const out = route.parent === this.#view
      ? this.#view.output
      : this.output.empty()

    this.#view = view
    // view.attr({ ...props, ...route.attr() })
    out.appendChild(view)
  }

  listen = e => {
    $.stop(e)
    const route = e.target.get('route')

    if (!route)
      return history.back()

    const url = new URL(route, location.origin)
    if (url.pathname == location.pathname)
      return

    push(route)
    this.go(url)
  }

}

customElements.define('ws-router', Router)
