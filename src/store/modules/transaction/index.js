import { api } from 'src/boot/axios'
import router from 'src/router'

export default {
  namespaced: true,
  state: () => ({
    transaction: {
      unit_id: null,
      biller_id: null,
      account_id: null,
      service_number: null,
      number: null,
      amount: 0,
      insertedAmount: 0,
      status: 'pending'
    },
    askDialog: false,
    paymentDialog: false,
    insertingPayment: false,
    transactionDialog: false,
    creatingTransaction: false
  }),
  getters: {
    getTransaction: state => state.transaction,
    getInsertedPayment: state => state.transaction.insertedAmount,
    getInsertedAmount: state => state.transaction.amount,
    canCreate: state => state.transaction.insertedAmount >= state.transaction.amount,
    isInsertingPayment: state => state.insertingPayment,
    openPaymentDialog: state => state.paymentDialog,
    openAskDialog: state => state.askDialog,
    openTransactionDialog: state => state.transactionDialog,
    isCreatingTransaction: state => state.creatingTransaction
  },
  actions: {
    CREATE_TRANSACTION: async ({ commit, dispatch, getters }, transaction) => {
      dispatch('OPEN_TRANSACTION_DIALOG')
      await api.post(`/units/${transaction.unit_id}/transactions`, transaction)
        .then(({ data }) => {
          commit('SET_TRANSACTION_CREATING_STATUS', false)
          commit('SET_TRANSACTION', { ...data, insertedAmount: getters.getInsertedPayment })
        }).catch(errors => console.log(errors))
    },
    ADD_PAYMENT: async ({ commit, getters, dispatch }, amount) => {
      const newAmount = getters.getInsertedPayment + amount
      commit('SET_INSERTING_STATUS', true)
      setTimeout(() => {
        commit('SET_INSERTING_STATUS', false)
        commit('SET_PAYMENT', newAmount)
        if (getters.canCreate) {
          dispatch(
            'CREATE_TRANSACTION',
            {
              ...getters.getTransaction,
              insertedAmount: newAmount
            }
          )
        }
      }, 2000)
    },
    OPEN_TRANSACTION_DIALOG: ({ commit }) => {
      commit('SET_PAYMENT_DIALOG_STATUS', false)
      commit('SET_TRANSACTION_DIALOG_STATUS', true)
      commit('SET_TRANSACTION_CREATING_STATUS', true)
    },
    FINISH_TRANSACTION: ({ commit }) => {
      commit('SET_TRANSACTION_DIALOG_STATUS', false)
      router().push({ name: 'billers' })
    },
    CONFIRM: ({ commit }) => {
      commit('transactions/SET_ASK_DIALOG_STATUS', true)
    }
  },
  mutations: {
    SET_TRANSACTION: (state, transaction) => {
      state.transaction = transaction
    },
    SET_PAYMENT: (state, amount) => {
      state.transaction.insertedAmount = amount
    },
    SET_TRANSACTION_INFO: (state, info) => {
      state.transaction.unit_id = info.unit_id
      state.transaction.biller_id = info.biller_id
      state.transaction.service_number = info.service_number
      state.transaction.account_id = info.account_id
      state.transaction.number = info.number
      state.transaction.amount = info.amount
    },
    SET_INSERTING_STATUS: (state, isLoading) => {
      state.insertingPayment = isLoading
    },
    SET_PAYMENT_DIALOG_STATUS: (state, isOpen) => {
      state.paymentDialog = isOpen
    },
    SET_ASK_DIALOG_STATUS: (state, isOpen) => {
      state.askDialog = isOpen
    },
    SET_TRANSACTION_DIALOG_STATUS: (state, isOpen) => {
      state.transactionDialog = isOpen
    },
    SET_TRANSACTION_CREATING_STATUS: (state, status) => {
      state.creatingTransaction = status
    }
  }
}
