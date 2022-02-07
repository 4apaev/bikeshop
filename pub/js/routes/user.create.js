import Sync from '/js/Sync.js'

export default class Auth extends HTMLElement {
  uid = crypto.randomUUID().replace(/^[\d-]+/, '')
  tmpl = `
    <style>
      @import url('/css/auth.styl?margin=0&uid=${ this.uid }')
    </style>

    <form class="${ this.uid }">
      <legend>sign up</legend>

      <blockquote></blockquote>

      <fieldset>
        <label for=uname>name</label>
        <input
          required
          id=uname
          name=uname
          type=text
          placeholder=alice
        />
      </fieldset>

      <fieldset>
        <label for=email>email</label>
        <input
          required
          id=email
          name=email
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

  disconnectedCallback() {
    this.off('submit')
    this.off('change')
  }

  connectedCallback() {
    this.html(this.tmpl)
    this.on('submit', this.submit)
    this.on('change', () => this.show())
  }

  send() {
    const form = this.$('form')
    return Sync.post('/api/user', {
      uname: form.uname.value,
      email: form.email.value,
      pass: form.pass.value,
    })
  }

  reset() {
    this.$('form').reset()
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
      this.$('.send').set('disabled', false)
    }
  }

}

customElements.define('ws-auth', Auth)
