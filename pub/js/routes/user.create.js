import $ from '/js/dom.js'
import Sync from '../sync.js'
import Base from '../comp/form.js'

export default class Auth extends Base {
  css = `@import url('/css/auth.css?margin=0&uid=${ this.uid }')`
  tmpl = `
    <form>
      <legend>sign up</legend>
      <blockquote/>

      <fieldset>
        <label for=name>name</label>
        <input
          required
          id=name
          name=name
          type=text
          placeholder=alice
        />
      </fieldset>

      <fieldset>
        <label for=mail>mail</label>
        <input
          required
          id=mail
          name=mail
          type=email
          minLength="6"
          placeholder="alice@shoshi.dog"
        />
      </fieldset>

      <fieldset>
        <label for=pass>password</label>
        <input
          required
          id=pass
          name=pass
          type=password
          placeholder="!123"
        />
      </fieldset>
      <button class="btn send">sign up</button>
    </form>
  `
  #form

  get form() {
    return this.#form ??= this.$('form')
  }

  connectedCallback() {
    super.connectedCallback()

    this.on('submit', this.submit)
    this.on('change', () => this.show())
  }

  reset() {
    this.form.reset()
    this.form.$('btn.send').set('disabled', false)
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

    const btn = this.form.$('btn.send')
    btn.toggle('disabled', true)

    try {
      const re = await Sync.post('/api/users', {
        name: this.form.name.value,
        mail: this.form.mail.value,
        pass: this.form.pass.value,
      })
      this.emit('fetch', re.body)
      history.replaceState({}, 'some', location.pathname)
    }
    catch (err) {
      this.show(err?.message ?? err?.body?.message ?? 'Error', 1)
    }

    finally {
      this.reset()
    }
  }

}

customElements.define('ws-auth', Auth)
