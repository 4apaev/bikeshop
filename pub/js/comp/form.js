import $ from '../dom.js'
import Sync from '../sync.js'
import Base from './base.js'
import O from '../../../util/define.js'

export default class Form extends Base {

  tmpl = `
    <form class="create-entry">
      <header>
        <h3 class="title">${ this.title }</h3>
      </header>

      <blockquote></blockquote>

      <main class="container">
        <slot></slot>
      </main>

      <footer>
        <button class="btn send">create</button>
      </footer>
    </form>
  `

  #form

  get form() {
    return this.#form ??= this.$('form')
  }

  get payload() {
    return Object.fromEntries(new FormData(this.form))
  }

  connectedCallback() {
    super.connectedCallback()
    this.on('submit', this.submit)
    this.on('change', () => this.show())
  }

  appendField({ key, label, options, ...opt }) {
    const id = `${ this.uid }-${ key }`
    opt.id = id
    opt.name ??= key
    const input = options
      ? $.select(opt, ...options.map(o => $.option({ value: o }, o)))
      : $.input(opt)
    this.$('.container').appendChild($.fieldset($.label({ for: id }, label), input))
  }

  appendInputField({ key, label, options, ...opt }) {

    const attrs = O.each((v, k, prev) => {
      prev + `${ k }="${ v }"`
    }, '')

    this.$('.container').html`
      <fieldset>
        <label for="${ this.uid }-${ key }">${ label }</label>
      </fieldset>
    `
  }

  send() {
    const url = this.get('apiurl')
    const method = this.get('method') ?? 'post'
    return Sync[ method ](url, this.payload)
  }

  reset() {
    this.$('form').reset()
    this.$('.send').set('disabled', false)
  }

  show(msg, err) {
    const bq = this.$('blockquote')
    bq.text = msg ?? ''
    if (err)
      bq.cls.add('err')
    else
      bq.cls.remove('err')
  }

  submit = async e => {
    $.stop(e)

    this.$('.send').set('disabled', true)

    try {
      await this.send()
    }
    catch (err) {
      this.show(err?.message ?? err?.body?.message ?? 'Error', 1)
    }
    finally {
      this.reset()
    }
  }

}

Form.define()
