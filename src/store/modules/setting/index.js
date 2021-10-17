import { api } from 'src/boot/axios'

export default {
  namespaced: true,
  state: () => ({
    setting: null
  }),
  getters: {
    getSetting: state => state.setting
  },
  actions: {
    getSetting: async ({ commit }) => {
      await api.get('/settings').then(({ data }) => {
        commit('SET_SETTING', data)
      })
    }
  },
  mutations: {
    SET_SETTING: (state, setting) => {
      state.setting = setting
    }
  }
}
