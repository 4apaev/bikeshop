import Table from '/js/routes/table.js'

export default class Users extends Table {
  slug = 'user'
  title = 'Users'
  cells = [
    { key: 'id', type: 'number', label: 'uid'  },
    { key: 'uname', type: 'text', label: 'name'  },
    { key: 'email', type: 'email', label: 'email' },
  ]

  fields = [
    {
      key: 'uname',
      type: 'text',
      label: 'name',
      placeholder: 'alice',
      required: true,
    },
    {
      key: 'email',
      type: 'email',
      label: 'email',
      placeholder: 'alice@shoshi.dog',
      required: true,
    },
    {
      key: 'pass',
      type: 'password',
      label: 'password',
      placeholder: '!123',
      required: true,
      minLength: 6,
    },
  ]

  apiUrl = `/api/users`
  createRoute = `/app/users/create`
}

Users.define()
