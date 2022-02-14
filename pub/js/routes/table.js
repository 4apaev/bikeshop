import $ from '/js/dom.js'
import Sync from '/js/sync.js'
import Base from '/js/comp/base.js'
import _Form from '/js/comp/form.js'

const µ = undefined

export default class Table extends Base {

  slug = 'table'
  title = 'table'
  apiUrl = `/api/${ this.slug }`

  css = `@import url('/css/table.styl?uid=${ this.uid }')`
  cells = []
  fields = []
  tmpl = `
    <header>
      <h2 class="title">${ this.title }</h2>
      <button class="btn ok create">create</button>
    </header>

    <table>
    </table>

    <dialog>
      <button class="close">✖</button>

      <ws-form
        class="create-entry"
        title="${ this.title }"
        apiurl="${ this.apiUrl }"
      >
      </ws-form>
    </dialog>
  `

  #form
  #dialog

  get form() {
    return this.#form ??= this.$('ws-form') 
  }

  get dialog() {
    return this.#dialog ??= this.$('dialog') 
  }

  connectedCallback() {
    super.connectedCallback()
    this.on('click', '.btn.create', this.toggleDialog)
    this.on('click', 'button.close', (e, stop) => (this.dialog.close(), stop))

    Sync.get(this.apiUrl, { limit: 10 })
        .then(this.render)
        .catch(Log.error)

  }

  toggleDialog = (e, stop) => {
    if (this.dialog.has('open'))
      return this.dialog.close()
      // , history.back(), stop
    this.dialog.showModal()
    return stop
  }

  render = ({ body }) => {
    const { frag } = $
    const form = this.$('ws-form')

    for (const row of body.value) {
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
