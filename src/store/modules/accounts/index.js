import { api } from 'src/boot/axios'

export default {
  namespaced: true,
  state: () => ({
    account: null
  }),
  getters: {
    GET_ACCOUNT: state => state.account
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    RESET_ACCOUNT_BALANCE: (state) => {
      state.account.balance = 0
    }
  },
  actions: {
    GET_ACCOUNT_OR_CREATE: async ({ commit }, account) => {
      return new Promise((resolve, reject) => {
        api.post('/billers/accounts/findOrCreate', account)
          .then(({ data }) => {
            commit('SET_ACCOUNT', data)
            resolve(data)
          })
          .catch(errors => reject(errors))
      })
    },
    USE_ACCOUNT_BALANCE: async (context, accountId) => {
      return new Promise((resolve, reject) => {
        api.put(`/billers/accounts/${accountId}/useBalance`)
          .then(({ data }) => {
            resolve(data)
          })
          .catch(errors => reject(errors))
      })
    }
  }
}
