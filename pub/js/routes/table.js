import $ from '/js/dom.js'
import Sync from '/js/sync.js'
import Base from '/js/comp/base.js'

const µ = undefined

export default class Table extends Base {

  slug = 'table'
  title = 'table'
  apiUrl = `/api/${ this.slug }`
  createRoute = `/app/${ this.slug }/create`
  css = `@import url('/css/table.styl?uid=${ this.uid }')`
  cells = []

  tmpl = `
    <h2>${ this.title }</h2>
    <a route="${ this.createRoute }?open=true">create</a>
    <table></table>

    <dialog>
      <a route>✕</a>
      <div name="output"></div>
    </dialog>

    <ws-route
      comp="ws-auth"
      src="/js/routes/user.create.js"
      path="${ this.createRoute }"
      apiUrl="${ this.apiUrl }"
    ></ws-route>
  `

  #dialog
  get dialog() {
    return this.#dialog ??= this.$('dialog')
  }

  get output() {
    return this.$('[name="output"]')
  }

  connectedCallback() {
    super.connectedCallback()
    // <thead></thead>

    this.on('click', 'a[route]', this.toggleDialog)
    Sync.get(this.apiUrl, { limit: 10 })
      .then(this.render)
      .catch(Log.error)
  }

  toggleDialog = (e, stop) => {
    if (this.dialog.has('open'))
      return this.dialog.close(), history.back(), stop
    return this.dialog.showModal()
  }

  render = ({ body }) => {
    const { frag } = $
    for (const row of body.value) {
      const tr = $.tr()
      for (const k of this.cells)
        tr.append($.td(µ, row[ k ]))
      frag.append(tr)
    }

    this.$('table').html`<tr>${ this.cells.map(k => `<th>${ k }</th>`).join('\n') }</tr>`
    this.$('table').append(frag)
  }
}

Table.define()

