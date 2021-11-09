import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage, Notify } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = process.env.DEV
  ? 'http://localhost:8000'
  : 'https://abm-ser-dev.herokuapp.com'

const api = axios.create({ baseURL: `${baseURL}/api` })

api.interceptors.request.use(
  function (config) {
    const token = LocalStorage.getItem('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  })
api.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  switch (error.response.status) {
    case 401:
      Notify.create({
        position: 'top',
        type: 'negative',
        message: 'Unauthorized access.'
      })
      break
    case 403:
      Notify.create({
        position: 'top',
        type: 'negative',
        message: 'Access is denied'
      })
      break
    case 404:
      Notify.create({
        position: 'top',
        type: 'negative',
        message: 'Resource not found.'
      })
      break
    case 500:
      Notify.create({
        position: 'top',
        type: 'negative',
        message: 'Internal server error.'
      })
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, baseURL }
