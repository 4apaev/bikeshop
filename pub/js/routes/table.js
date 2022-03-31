import $ from '/js/dom.js'
import Sync from '/js/sync.js'
import Base from '/js/comp/base.js'
import _Form from '/js/comp/form.js'

const µ = undefined

export default class Table extends Base {
  #req
  #form
  #dialog

  css = `@import url('/css/table.css?uid=${ this.uid }')`

  cells = []
  fields = []

  get tmpl() {
    const ttl = this.title ??= this.get('title')
    const api = this.apiurl ??= this.get('apiurl')
    return `
      <header>
        <h2 class="title">${ ttl }</h2>
        <button class="btn ok create">create</button>
      </header>

      <table>
      </table>

      <dialog>
        <button class="close">✖</button>

        <ws-form
          class="create-entry"
          title="${ ttl }"
          apiurl="${ api }"
        >
        </ws-form>
      </dialog>
    `
  }

  get form() {
    return this.#form ??= this.$('ws-form')
  }

  get dialog() {
    return this.#dialog ??= this.$('dialog')
  }

  connectedCallback() {
    super.connectedCallback()
    this.classList.add('ws-table')
    this.on('click', '.btn.create', this.toggleDialog)
    this.on('click', 'button.close', (e, stop) => (this.dialog.close(), stop))

    this.apiurl ??= this.get('apiurl')
    Sync.get(this.apiurl, { limit: 10 })
        .then(this.render, Log.error)
  }

  toggleDialog = (e, stop) => {
    if (this.dialog.has('open'))
      this.dialog.close()
    else
      this.dialog.showModal()
    return stop
  }

  render = ({ body }) => {
    const { frag } = $
    const form = this.$('ws-form')

    for (const row of body?.value ?? body) {
      const tr = $.tr()
      for (const x of this.cells)
        tr.append($.td(µ, row[ x.key ]))
      frag.append(tr)
    }

    this.$('table').html`<tr>${ this.cells.map(x => `<th>${ x.label }</th>`).join('\n') }</tr>`
    this.$('table').append(frag)
    form.set('apiurl', this.apiUrl)
    this.fields.forEach(form.appendField, form)
  }

}

Table.define()
