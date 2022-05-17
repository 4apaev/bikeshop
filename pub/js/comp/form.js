import $ from '../dom.js'
import Sync from '../sync.js'
import Base from './base.js'
import O from '../../../util/define.js'

export default class Form extends Base {
  #form
  #container

  get tmpl() {
    return `
    <form class="create-entry">
      <header>
        <h3 class="title">${ this.get('title') }</h3>
      </header>

      <blockquote></blockquote>

      <main class="container">
      </main>

      <footer>
        <button class="btn send">create</button>
      </footer>
    </form>
  `
  }

  get form() {
    return this.#form ??= this.$('form')
  }

  get container() {
    return this.#container ??= this.form.$('main.container')
  }

  connectedCallback() {
    super.connectedCallback()
    this.on('submit', this.submit)
    this.on('change', () => this.show())
  }

  appendField({ key, label, options, ...opt }) {
    const id = (opt.id ??= `${ this.uid }-${ key }`)
    opt.name ??= key

    const input = options
      ? $.select(opt, ...options.map(x =>
        O(x) === x
          ? $.option(x, x.value)
          : $.option({ value: x }, x)))
      : $.input(opt)

    this.container.appendChild(
      $.fieldset(
        $.label({ for: id },
          label ?? key),
        input))
  }

  send(x) {
    return Sync[ this.get('method') ?? 'post' ](this.get('apiurl')).send(x)
  }

  reset() {
    this.$('form').reset()
    this.$('.send').set('disabled', false)
  }

  show(msg, err) {
    const bq = this.$('blockquote')
    bq.text = msg ?? ''
    bq.classList.toggle('err', !!err)
  }

  submit = async e => {
    $.stop(e)

    this.$('.send').set('disabled', true)

    try {
      const body = O.from(new FormData(this.form))
      this.emit('before:send', body)
      const re = await this.send(body)
      this.emit('after:send', re)
    }
    catch (err) {
      this.emit('error', err)
      this.show(err?.message ?? err?.body?.message ?? 'Error', 1)
    }
    finally {
      this.reset()
    }
  }
}

Form.define()
