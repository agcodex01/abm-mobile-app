import { boot } from 'quasar/wrappers'

import { io } from 'socket.io-client'

const socketBaseURL = process.env.DEV ? 'http://localhost:5000' : 'https://abm-simulator.herokuapp.com'

const socket = io(socketBaseURL)

export default boot(async ({ app }) => {
  app.config.globalProperties.$socket = socket
})
