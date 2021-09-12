import { LocalStorage } from 'quasar'

export default {
  namespaced: true,
  state: () => ({
    unitId: ''
  }),
  getters: {
    getUnitId: state => {
      const fromLocalUnitId = LocalStorage.getItem('unitId')
      if (fromLocalUnitId) {
        return fromLocalUnitId
      }

      return state.unitId
    }
  },
  actions: {
    setUnitId: ({ commit }, unitId) => {
      commit('SET_UNIT', unitId)
    }
  },
  mutations: {
    SET_UNIT (state, unitId) {
      state.unit = unitId
      LocalStorage.set('unitId', unitId)
    }
  }
}
