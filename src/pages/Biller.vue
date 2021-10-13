<template>
  <q-page padding class="q-mx-auto q-mt-none" style="width:700px; heigth:100%">
    <div class="text-center">
      <h4 class="title">Payments Requirement</h4>
      <h6>Transaction Fee : P 400.00</h6>
    </div>
    <q-form
      @submit="onConfirm"
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
          <h4 align="center" v-if="creatingTransaction">Transaction Inprogress.</h4>
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
              <div class="text-subtitle2">: {{ transaction.amount }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Payment Inserted</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction.insertedAmount }}</div>
            </div>
          </div>
          </div>
        </q-card-section>
        <q-card-section class="text-center" v-show="creatingTransaction">
          <q-spinner-ios color="primary" size="3em"/>
           <p>Creating transaction in progress...</p>
        </q-card-section>
        <q-card-section class="text-center" v-show="!creatingTransaction">
          <q-icon name="task_alt" size="64px" color="positive" />
          <p class="q-mt-md">Sms message will be sent to your mobile number for confirmation.</p>
          <q-btn color="primary" label="Close" class="full-width" v-close-popup/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentDialog" persistent >
      <q-card class="q-px-lg q-pb-lg" style="min-width:640px">
        <q-card-section class="q-mt-md text-center">
          <div class="text-h4">Insert Payment</div>
        </q-card-section>
        <hr>
        <q-card-section class="row">
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Amount </div>
             <div class="text-subtitle1" style="font-size:24px"> {{ transaction.amount }} </div>
          </div>
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Balance </div>
             <div class="text-subtitle1" style="font-size:24px"> {{ account.balance }} </div>
          </div>
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Payment </div>
             <div class="text-subtitle1" style="font-size:24px"> {{ transaction.insertedAmount }} </div>
          </div>
          <div class="col-12 q-mt-lg">
            <div class="text-center q-mb-lg" v-show="insertingPayment">
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
      amount: 0,
      insertedAmount: 0,
      status: 'pending'
    },
    askDialog: false,
    paymentDialog: false,
    transactionDialog: false,
    creatingTransaction: false,
    continue: true,
    showConfiramtionDialog: false,
    showPaymentDialog: false,
    insertingPayment: false,
    hasInserted: false,
    insertedPayment: 0,
    money: [1, 5, 10, 20, 50, 100, 200, 500, 1000]
  }),
  computed: {
    ...mapGetters({
      biller: 'billers/getBiller',
      unitId: 'units/getUnitId',
      account: 'accounts/GET_ACCOUNT'
    }),
    canCreateTransaction () {
      return this.hasInserted && this.transaction.insertedAmount >= this.transaction.amount
    }
  },
  methods: {
    ...mapActions({
      useAccountBalance: 'accounts/USE_ACCOUNT_BALANCE'
    }),
    onConfirm () {
      this.askDialog = true
    },
    async onYes () {
      this.askDialog = false
      await this.$store.dispatch('accounts/GET_ACCOUNT_OR_CREATE', {
        biller_id: this.biller.id,
        service_number: this.transaction.service_number
      }).then(() => {
        this.transaction.account_id = this.account.id
      })
      this.paymentDialog = true
    },
    async onCreate () {
      this.askDialog = false
      this.paymentDialog = false
      this.transactionDialog = true
      this.creatingTransaction = true
      await this.$store.dispatch('transactions/CREATE_TRANSACTION', this.transaction)
        .then(() => {
          this.creatingTransaction = false
          this.hasInserted = false
          setTimeout(() => {
            this.$router.push({ name: 'billers' })
          }, 2000)
        })
    },
    addPayment (n) {
      this.hasInserted = true
      this.insertingPayment = true
      setTimeout(() => {
        this.transaction.insertedAmount += n
        this.createTransaction()
        this.insertingPayment = false
      }, 1000)
    },
    async onUseAccountBalance () {
      await this.useAccountBalance(this.account.id)
        .then(success => {
          if (success) {
            this.transaction.insertedAmount += this.account.balance
            this.hasInserted = true
            this.createTransaction()
            this.$store.commit('accounts/RESET_ACCOUNT_BALANCE')
          }
        })
    },
    createTransaction () {
      if (this.canCreateTransaction) {
        this.onCreate()
      }
    }
  },
  async mounted () {
    this.$socket.on('connect', function () {
      console.log('CONNECTED TO SIMULATOR')
    })
    this.$socket.on('insertPayment', (amount) => {
      this.addPayment(amount)
    })

    await this.$store.dispatch('billers/getBillerById', this.$route.params.id)
    this.$store.commit('layout/SET_HEADER', this.biller.name)
    this.transaction.unit_id = this.unitId
    this.transaction.biller_id = this.biller.id
  }
}
</script>

<style lang="scss">
  .btn-submit {
    padding: 16px 0px;
  }
</style>
