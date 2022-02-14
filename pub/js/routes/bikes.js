import Table from '/js/routes/table.js'

export default class Bikes extends Table {
  slug = 'bike'
  title = 'Bikes'
  apiUrl = `/api/bikes`
  createRoute = `/app/bikes/create`
  // cells = [ 'id', 'kind', 'details' ]
  cells = [
    { key: 'id', type: 'number', label: 'id'  },
    { key: 'details', type: 'text', label: 'details' },
    { key: 'kind', type: 'enum', label: 'kind' },
  ]

  fields = [
    {
      key: 'details',
      type: 'text',
      label: 'details',
      placeholder: 'bike desc',
    },
    {
      key: 'kind',
      label: 'kind',
      required: true,
      options: [
        'city',
        'road',
        'mountain',
        'cruiser',
        'electric',
        'folding',
        'fixie',
      ],
    },
  ]

}

Bikes.define()
