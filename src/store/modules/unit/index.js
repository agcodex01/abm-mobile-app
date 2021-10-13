import { LocalStorage } from 'quasar'

export default {
  namespaced: true,
  state: () => ({
    unitId: '',
    token: ''
  }),
  getters: {
    getUnitId: state => {
      const fromLocalUnitId = LocalStorage.getItem('unitId')
      if (fromLocalUnitId) {
        return fromLocalUnitId
      }

      return state.unitId
    },
    getToken: state => {
      const fromLocalToken = LocalStorage.getItem('token')
      if (fromLocalToken) {
        return fromLocalToken
      }

      return state.token
    }
  },
  actions: {
    SET_CONFIG: ({ commit }, { unitId, token }) => {
      commit('SET_UNIT_ID', unitId)
      commit('SET_TOKEN', token)
    }
  },
  mutations: {
    SET_UNIT_ID (state, unitId) {
      state.unit = unitId
      LocalStorage.set('unitId', unitId)
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      LocalStorage.set('token', token)
    }
  }
}
