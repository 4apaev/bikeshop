import Table from '/js/routes/table.js'

export default class Scheduler extends Table {

  slug = 'scheduler'
  title = 'Scheduler'
  cells = [ 'uid', 'bid', 'checkin', 'checkout' ]
  apiUrl = `/api/user-bikes`
  createRoute = `/app/scheduler/create`
}

Scheduler.define()

