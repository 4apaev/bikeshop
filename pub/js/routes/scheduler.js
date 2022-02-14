import Table from '/js/routes/table.js'

export default class Scheduler extends Table {

  slug = 'scheduler'
  stitle = 'Scheduler'
  apiUrl = `/api/user-bikes`
  createRoute = `/app/scheduler/create`
  cells = [
    { key: 'uid', type: 'number', label: 'user id'  },
    { key: 'bid', type: 'number', label: 'bike id'  },
    { key: 'checkin', type: 'date', label: 'checkin' },
    { key: 'checkout', type: 'date', label: 'checkout' },
  ]

  fields = [
    { key: 'uid', type: 'number', label: 'user id', required: true   },
    { key: 'bid', type: 'number', label: 'bike id', required: true  },
    { key: 'checkin', type: 'date', label: 'checkin' },
    { key: 'checkout', type: 'date', label: 'checkout' },
  ]
}

Scheduler.define()

