import { api } from 'src/boot/axios'

export default {
  namespaced: true,
  state: () => ({
    dialogState: false,
    loading: false
  }),
  getters: {
    getDialogState: state => state.dialogState,
    getLoading: state => state.loading
  },
  actions: {
    CREATE_FEEDBACK: ({ commit }, feedback) => {
      return new Promise((resolve, reject) => {
        commit('SET_LOADING', true)
        api.post('/feedback', feedback).then(response => {
          resolve(response)
        }).catch(errors => reject(errors.response.data.errors))
          .finally(() => commit('SET_LOADING', false))
      })
    },
    SET_DIALOG_STATE: ({ commit }, currentState) => {
      commit('SET_DIALOG_STATE', currentState)
    }
  },
  mutations: {
    SET_DIALOG_STATE: (state, isOpen) => {
      state.dialogState = isOpen
    },
    SET_LOADING: (state, isLoading) => {
      state.loading = isLoading
    }
  }
}
