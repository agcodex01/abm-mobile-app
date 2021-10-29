import { boot } from 'quasar/wrappers'

import { io } from 'socket.io-client'
// import store from 'src/store'

const socketBaseURL = process.env.DEV ? 'http://localhost:5000' : 'https://abm-simulator.herokuapp.com'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
const socket = io(socketBaseURL)

// socket.on('insertPayment', (amount = 0) => {
// window.dispatchEvent(new CustomEvent('ADD_PAYMENT', {
//   detail: amount
// }))
// store().dispatch('transactions/ADD_PAYMENT', amount)
// })

export default boot(async ({ app }) => {
  app.config.globalProperties.$socket = socket
})
