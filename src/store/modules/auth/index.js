import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  namespaced: true,
  state: () => ({
    token: null,
    loading: false
  }),
  getters: {
    getToken: state => state.token || LocalStorage.getItem('user_token'),
    getLoading: state => state.loading
  },
  actions: {
    login: ({ commit }, credential) => {
      return new Promise((resolve, reject) => {
        commit('SET_LOADING', true)
        api.post('/login', credential).then(({ data }) => {
          resolve(data)
          commit('SET_TOKEN', data.token)
          LocalStorage.set('user_token', data.token)
        }).catch(errors => reject(errors.response.data.errors))
          .finally(() => commit('SET_LOADING', false))
      })
    },
    logout: ({ commit }) => {
      commit('SET_TOKEN', null)
      LocalStorage.remove('user_token')
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_LOADING: (state, isLoading) => {
      state.loading = isLoading
    }
  }
}
