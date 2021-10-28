import { date } from 'quasar'

export default [
  {
    name: 'id',
    field: 'id',
    label: 'ID',
    align: 'left',
    required: true,
    sortable: true,
    sortOrder: 'ad'
  },
  {
    name: 'biller',
    align: 'left',
    field: 'biller_name',
    label: 'Biller',
    sortable: true
  },
  {
    name: 'amount',
    field: 'amount',
    label: 'Amount',
    align: 'left',
    sortable: true
  },
  {
    name: 'service_number',
    align: 'left',
    field: 'service_number',
    label: 'Service Number',
    sortable: true
  },
  {
    name: 'create_at',
    align: 'left',
    field: 'created_at',
    format: val => date.formatDate(val, 'ddd D MMM YYYY'),
    label: 'Created At',
    sortable: true
  },
  {
    name: 'status',
    align: 'left',
    field: 'status',
    label: 'Status'
  }
]
