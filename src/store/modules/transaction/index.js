import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'
import tableHeader from './transactions_logs'

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
    biller_name: null,
    askDialog: false,
    paymentDialog: false,
    insertingPayment: false,
    transactionDialog: false,
    creatingTransaction: false,
    logs: [],
    tableHeader: tableHeader
  }),
  getters: {
    getTransaction: state => state.transaction,
    getLogs: state => {
      if (state.logs.length < 1) {
        return JSON.parse(LocalStorage.getItem('transactionLogs') || '[]')
      }
      return state.logs
    },
    getBillerName: state => state.biller_name,
    getInsertedPayment: state => state.transaction.insertedAmount,
    getInsertedAmount: state => state.transaction.amount,
    canCreate: state => state.transaction.insertedAmount >= state.transaction.amount,
    isInsertingPayment: state => state.insertingPayment,
    openPaymentDialog: state => state.paymentDialog,
    openAskDialog: state => state.askDialog,
    openTransactionDialog: state => state.transactionDialog,
    isCreatingTransaction: state => state.creatingTransaction,
    getTableHeader: state => state.tableHeader
  },
  actions: {
    CREATE_TRANSACTION: async ({ commit, dispatch, getters }, transaction) => {
      dispatch('OPEN_TRANSACTION_DIALOG')
      await api.post(`/units/${transaction.unit_id}/transactions`, transaction)
        .then(({ data }) => {
          commit('SET_TRANSACTION_CREATING_STATUS', false)
          commit('SET_TRANSACTION', { ...data, insertedAmount: getters.getInsertedPayment })
          dispatch('SET_TRANSACTION_LOGS', { ...data, biller_name: getters.getBillerName, status: 'Success' })
        }).catch(() => {
          dispatch('SET_TRANSACTION_LOGS', { ...transaction, biller_name: getters.getBillerName, status: 'Failed' })
        })
    },
    SET_TRANSACTION_LOGS: async ({ commit }, transactionLogs) => {
      const logs = JSON.parse(LocalStorage.getItem('transactionLogs') || '[]')
      logs.push(transactionLogs)
      LocalStorage.set('transactionLogs', JSON.stringify(logs))
      commit('SET_TRANSACTION_LOGS', logs)
    },
    ADD_PAYMENT: async ({ commit, getters, dispatch }, amount) => {
      const newAmount = parseFloat(getters.getInsertedPayment) + parseFloat(amount)
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
      commit('SET_PAYMENT', 0)
    },
    CONFIRM: ({ commit }) => {
      commit('SET_ASK_DIALOG_STATUS', true)
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
      state.biller_name = info.biller_name
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
    },
    SET_TRANSACTION_LOGS: (state, logs) => {
      state.logs = logs
    }
  }
}
