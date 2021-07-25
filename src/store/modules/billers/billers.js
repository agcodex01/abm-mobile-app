const billers = [
  {
    id: 1,
    type: 'I',
    name: 'PLDT',
    description: 'Test'
  },
  {
    id: 2,
    type: 'I',
    name: 'SMART',
    description: 'Test'
  },
  {
    id: 3,
    type: 'W',
    name: 'MCWD',
    description: 'Test'
  },
  {
    id: 4,
    type: 'W',
    name: 'Maynilad',
    description: 'Test'
  },
  {
    id: 5,
    type: 'E',
    name: 'Meralco',
    description: 'Test'
  }
]

module.exports = {
  all: () => billers,
  findById: id => billers.find(biller => biller.id === id)
}
