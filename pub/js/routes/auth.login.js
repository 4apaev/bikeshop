
// import Sync from '/js/sync.js'
// import Base from '/js/comp/base.js'
import Form from '/js/comp/form.js'

// import Auth from '/js/routes/user.create.js'

export default class Login extends Form {
  // css = `@import url('/css/auth.css?margin=2em&uid=${ this.uid }')`

  title = 'Login'
  apiurl = '/api/user/auth'
  // tmpl = `
  //   <ws-form title="Login" apiurl="/api/user/auth" method="post">
  //   </ws-form>
  // `

  connectedCallback() {
    super.connectedCallback()
    this.appendField({
      key: 'mail',
      id: 'mail',
      name: 'mail',
      type: 'email',
      placeholder: 'alice@shoshi.dog',
      required: true,
    })
    this.appendField({
      key: 'pass',
      id: 'pass',
      name: 'pass',
      type: 'password',
      placeholder: '!123',
      minLength: 3,
      required: true,
    })

    this.$('footer').insert(`<a slot="foot" route="/app/remind">Remind</a>`)
  }

}

Login.define()
