import { api } from 'src/boot/axios'

export default {
  namespaced: true,
  state: () => ({
    billerSearch: '',
    billers: [],
    biller: null
  }),
  getters: {
    getBillers: state => state.billers
      .filter(
        biller => biller.name
          .toLowerCase()
          .includes(state.billerSearch.toLowerCase())
      ),
    getBiller: state => state.biller
  },
  actions: {
    getBillers: async ({ commit }) => {
      await api.get('/billers').then(({ data }) => {
        commit('SET_BILLERS', data)
      })
    },
    getBillerById: async ({ commit }, id) => {
      await api.get(`/billers/${id}`).then(({ data }) => {
        commit('SET_BILLER', data)
      })
    },
    setNewStringSearch: ({ commit }, searchString) => commit('SET_BILLER_SEARCH', searchString)
  },
  mutations: {
    SET_BILLERS (state, billers) {
      state.billers = billers
    },
    SET_BILLER_SEARCH (state, searchString) {
      state.billerSearch = searchString
    },
    SET_BILLER (state, biller) {
      state.biller = biller
    }
  }
}
