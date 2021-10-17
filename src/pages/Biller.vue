<template>
  <q-page padding class="q-mx-auto q-mt-none" style="width:700px; heigth:100%">
    <div class="text-center">
      <h4 class="title">Payments Requirement</h4>
      <h6>Transaction Fee : P {{ setting?.fee }}</h6>
    </div>
    <q-form
      @submit="confirm"
      class="q-gutter-md"
    >
      <q-input
        v-model="transaction.service_number"
        type="text" label="Service Number"
        outlined
        :rules="[ val => val && val.length > 0 || 'Service number is required.']"
         />
          <q-input
        v-model="transaction.number"
        type="number" label="Phone Number"
        outlined
        :rules="[ val => val && val.length > 0 || 'Phone number is required.']"
         />
         <q-input
        v-model="transaction.amount"
        type="number"
        label="Amount"
        outlined
        :rules="[ val => val && val > 99 || 'Invalid amount. Should be greather than 100']"
         />
      <div>
        <q-btn label="Confirm" padding="md sm" type="submit"  color="primary" class="full-width btn-submit"/>
      </div>
    </q-form>
    <q-dialog v-model="askDialog">
      <q-card class="q-pb-lg q-pt-sm" style="width:400px;">
        <q-card-section class="text-center q-pa-none">
          <h5>Do you want to continue?</h5>
        </q-card-section>
        <q-card-actions class="q-pa-none q-mb-md row justify-evenly">
          <q-btn class="app-dialog-button-padding btn-rounded"  outline label="No" padding="sm xl" color="primary" v-close-popup />
          <q-btn class="app-dialog-button-padding btn-rounded" label="Yes" padding="sm xl" color="primary" @click="onYes" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transactionDialog" persistent>
      <q-card class="q-pb-lg q-pt-sm" style="width:400px;">
        <q-card-section class="q-pa-none">
          <h4 align="center" v-if="isCreatingTransaction">Transaction Inprogress.</h4>
          <h4 align="center" v-else>Transaction Completed.</h4>
          <div class="q-px-lg">
            <div class="row">
            <div class="col-4">
              <div class="text-subtitle2">Biller</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ biller.name }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Service Number</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction.service_number }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Phone Number</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction.number }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Amount</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ amount }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Payment Inserted</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ insertedPayment }}</div>
            </div>
          </div>
          </div>
        </q-card-section>
        <q-card-section class="text-center" v-show="isCreatingTransaction">
          <q-spinner-ios color="primary" size="3em"/>
           <p>Creating transaction in progress...</p>
        </q-card-section>
        <q-card-section class="text-center" v-show="!isCreatingTransaction">
          <q-icon name="task_alt" size="64px" color="positive" />
          <p class="q-mt-md">Sms message will be sent to your mobile number for confirmation.</p>
          <q-btn color="primary" label="Close" class="full-width" @click="finishTransaction"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentDialog" persistent >
      <q-card class="q-px-lg q-pb-lg" style="min-width:640px">
        <q-card-section class="q-pt-lg flex justify-between align-center">
          <div class="text-h5 text-weight-regular no-margin">Insert Payment</div>
          <q-btn v-if="account?.balance" color="primary" label="Use balance" :loading="usingBalance" @click="onUseAccountBalance"/>
        </q-card-section>
        <q-card-section class="row">
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Amount </div>
             <div class="text-subtitle1" style="font-size:24px"> {{ transaction.amount || 0 }} </div>
          </div>
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Balance </div>
             <div class="text-subtitle1 q-mb-md" style="font-size:24px"> {{ account.balance || 0 }} </div>
          </div>
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Payment </div>
             <div class="text-subtitle1" style="font-size:24px"> {{ insertedPayment }} </div>
          </div>
          <div class="col-12 q-mt-lg">
            <div class="text-center q-mb-lg" v-show="isInsertingPayment">
                <q-spinner-ios color="primary" size="3em"/>
                <p>Inserting payment in progress...</p>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Biller',
  data: () => ({
    transaction: {
      unit_id: null,
      biller_id: null,
      account_id: null,
      service_number: null,
      number: null,
      amount: 0
    },
    usingBalance: false
  }),
  computed: {
    ...mapGetters({
      biller: 'billers/getBiller',
      unitId: 'units/getUnitId',
      account: 'accounts/GET_ACCOUNT',
      setting: 'settings/getSetting',
      insertedPayment: 'transactions/getInsertedPayment',
      amount: 'transactions/getInsertedAmount',
      isInsertingPayment: 'transactions/isInsertingPayment',
      paymentDialog: 'transactions/openPaymentDialog',
      askDialog: 'transactions/openAskDialog',
      transactionDialog: 'transactions/openTransactionDialog',
      isCreatingTransaction: 'transactions/isCreatingTransaction'
    })
  },
  methods: {
    ...mapActions({
      useAccountBalance: 'accounts/USE_ACCOUNT_BALANCE',
      finishTransaction: 'transactions/FINISH_TRANSACTION',
      confirm: 'transactions/CONFIRM'
    }),
    async onYes () {
      this.$store.commit('transactions/SET_ASK_DIALOG_STATUS', false)
      await this.$store.dispatch('accounts/GET_ACCOUNT_OR_CREATE', {
        biller_id: this.biller.id,
        service_number: this.transaction.service_number
      }).then(() => {
        this.transaction.account_id = this.account.id
        this.transaction.amount = parseFloat(this.transaction.amount) + parseFloat(this.setting.fee)
        this.$store.commit('transactions/SET_TRANSACTION_INFO', this.transaction)
        this.$store.commit('transactions/SET_PAYMENT_DIALOG_STATUS', true)
      })
    },
    async onUseAccountBalance () {
      this.usingBalance = true
      await this.useAccountBalance(this.account.id)
        .then(success => {
          if (success) {
            this.$store.dispatch('transactions/ADD_PAYMENT', this.account.balance)
            this.$store.commit('accounts/RESET_ACCOUNT_BALANCE')
          }
        }).finally(() => {
          this.usingBalance = false
        })
    }
  },
  async mounted () {
    await this.$store.dispatch('billers/getBillerById', this.$route.params.id)
    await this.$store.dispatch('settings/getSetting')
    this.$store.commit('layout/SET_HEADER', this.biller.name)
    this.transaction.unit_id = this.unitId
    this.transaction.biller_id = this.biller.id
    window.addEventListener('ADD_PAYMENT', ({ detail }) => {
      this.$store.dispatch('transactions/ADD_PAYMENT', detail)
    })
  }
}
</script>

<style lang="scss">
  .btn-submit {
    padding: 16px 0px;
  }
</style>
