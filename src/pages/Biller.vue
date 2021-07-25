<template>
  <q-page padding class="q-mx-auto q-mt-none" style="width:700px; heigth:100%">
    <div class="text-center">
      <h4 class="title">Payments Requirement</h4>
      <h6>Transaction Fee : P 400.00</h6>
    </div>
    <q-form
      @submit="createTransaction"
      class="q-gutter-md"
    >
      <q-input
        v-model="transaction.account_number"
        type="text" label="Service Number"
        outlined
         />
          <q-input
        v-model="transaction.phone_number"
        type="text" label="Phone Number"
        outlined
         />
         <q-input
        v-model="transaction.amount"
        type="number"
        label="Amount"
        outlined
         />
      <div>
        <q-btn label="Confirm" padding="md sm" type="submit" color="primary" class="full-width btn-submit"/>
      </div>
    </q-form>
    <q-dialog v-model="showConfiramtionDialog" persistent>
      <q-card class="q-pb-lg q-pt-sm" style="width:400px;">
        <q-card-section class="text-center q-pa-none">
          <h5>Do you want to continue?</h5>
        </q-card-section>
        <q-card-actions class="q-pa-none q-mb-md row justify-evenly">
          <q-btn class="app-dialog-button-padding btn-rounded"  outline label="No" padding="sm xl" color="primary" v-close-popup />
          <q-btn class="app-dialog-button-padding btn-rounded" label="Yes" padding="sm xl" color="primary" @click="continueToPayment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showPaymentDialog" persistent>
      <q-card class="q-pb-lg q-pt-sm" style="width:400px;">
        <q-card-section class="text-center q-pa-none">
          <h4 v-if="insertingPayment">Insert Payment Now.</h4>
          <h4 v-else>Transaction Completed.</h4>
          <q-img
            width="150px"
            src="~assets/insert_payment.svg"
            :ratio="16/9"
            spinner-color="primary"
            spinner-size="82px"
          />
          <h5 class="q-mb-sm">Payment : P {{ transaction.amount }}</h5>
          <h5 class="no-margin">Inserted : P {{ insertedPayment }}</h5>
        </q-card-section>
        <q-card-section class="text-center" v-show="insertingPayment">
          <q-spinner-ios color="primary" size="3em"/>
           <p>Waiting payment ({{ remainingSecond }}s)</p>
          <q-btn color="negative" label="Cancel" class="full-width" />
        </q-card-section>
        <q-card-section class="text-center" v-show="!insertingPayment">
          <q-icon name="task_alt" size="64px" color="positive" />
          <p class="q-mt-md">Sms message will be sent to your mobile number for confirmation.</p>
          <q-btn color="primary" label="Close" class="full-width" v-close-popup/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Biller',
  data: () => ({
    transaction: {
      account_number: null,
      phone_number: null,
      amount: 0
    },
    showConfiramtionDialog: false,
    showPaymentDialog: true,
    insertingPayment: true,
    remainingSecond: 30,
    insertedPayment: 0
  }),
  computed: {
    ...mapGetters({
      biller: 'billers/getBiller'
    })
  },
  methods: {
    createTransaction () {
      this.showConfiramtionDialog = true
    },
    continueToPayment () {
      this.showConfiramtionDialog = false
      this.showPaymentDialog = true
    },
    waitToInsertPayment () {
      const timer = setTimeout(() => {
        if (this.remainingSecond-- === 1 || this.insertedPayment === this.transaction.amount) {
          return clearTimeout(timer)
        }
        this.waitToInsertPayment()
      }, 1000)
    },
    insertPaymentSimulation () {
      this.waitToInsertPayment()
      const insertPayment = setInterval(() => {
        this.insertedPayment += 100
        this.remainingSecond = 30
        if (this.insertedPayment === this.transaction.amount) {
          this.insertingPayment = false
          clearInterval(insertPayment)
        }
      }, 5000)
    }
  },
  mounted () {
    this.transaction.amount = 1000
    this.insertPaymentSimulation()
    this.$store.dispatch('billers/getBillerById', parseInt(this.$route.params.id))
    this.$store.commit('layout/SET_HEADER', this.biller.name)
  }
}
</script>

<style lang="scss">
  .btn-submit {
    padding: 16px 0px;
  }
</style>
