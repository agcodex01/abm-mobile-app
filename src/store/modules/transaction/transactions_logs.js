import { date } from 'quasar'

export default [
  {
    name: 'insertedAmount',
    field: 'insertedAmount',
    label: 'Inserted Amount',
    align: 'left'
  },
  {
    name: 'amount',
    field: 'amount',
    label: 'Amount',
    align: 'left'
  },
  {
    name: 'service_number',
    align: 'left',
    field: 'service_number',
    label: 'Service Number'
  },
  {
    name: 'create_at',
    align: 'left',
    field: 'created_at',
    format: val => date.formatDate(val, 'ddd D MMM YYYY'),
    label: 'Created At'
  },
  {
    name: 'status',
    align: 'left',
    field: 'status',
    label: 'Status'
  }
]
