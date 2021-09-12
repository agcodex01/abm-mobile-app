import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import accounts from './modules/accounts'
import billers from './modules/billers'
import layout from './modules/layout'
import units from './modules/unit'
import transactions from './modules/transaction'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      accounts,
      billers,
      layout,
      units,
      transactions
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
