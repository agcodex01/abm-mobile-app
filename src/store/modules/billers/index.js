const Biller = require('./billers')

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
    getBillers: ({ commit }) => commit('SET_BILLERS', Biller.all()),
    getBillerById: ({ commit }, id) => commit('SET_BILLER', Biller.findById(id)),
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
