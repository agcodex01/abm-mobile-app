export default {
  namespaced: true,
  state: () => ({
    header: ''
  }),
  getters: {
    getHeader: state => state.header
  },
  actions: {},
  mutations: {
    SET_HEADER (state, newHeader) {
      state.header = newHeader
    }
  }
}
