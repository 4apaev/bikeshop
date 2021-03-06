import Form from '/js/comp/form.js'

export default class Remind extends Form {
  title = 'Remind'
  apiurl = '/api/user/auth'

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
    this.$('footer').insert(`
      <a slot="foot" route="/app/login">login</a>
    `)
  }

}

Remind.define()
