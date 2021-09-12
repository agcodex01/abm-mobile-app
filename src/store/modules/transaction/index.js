import { api } from 'src/boot/axios'

export default {
  namespaced: true,
  state: () => ({
    transaction: null
  }),
  actions: {
    CREATE_TRANSACTION: async ({ commit }, transaction) => {
      await api.post(`/units/${transaction.unit_id}/transactions`, transaction)
        .then(({ data }) => {
          commit('SET_TRANSACTION', data)
        }).catch(errors => console.log(errors))
    }
  },
  mutations: {
    SET_TRANSACTION (state, transaction) {
      state.transaction = transaction
    }
  }
}
