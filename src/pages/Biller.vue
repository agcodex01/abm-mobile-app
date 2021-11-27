<template>
  <q-page padding class="q-mx-auto q-mt-none" style="width:700px; heigth:100%">
    <div v-if="fetching" class="text-center">
      <h4>Fetching...</h4>
      <q-skeleton type="rect" height="60px" class="q-mb-md" v-for="n in 4" :key="n" />
    </div>
    <div v-else-if="!fetching && !biller">
      <q-btn color="primary" icon="check" label="OK" :to="{name: 'billers'}" />
      <h4>Service unavailable.</h4>
    </div>
    <div v-else>
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
        type="text"
        label="Phone Number"
        outlined
        :rules="[
          val => val && val.length > 0 || 'Phone number is required.',
          val => (val.match('^(09|\\+639)\\d{9}$')) || 'Invalid phone number.'
        ]"
         />
         <q-input
        v-model="transaction.amount"
        type="number"
        label="Amount"
        outlined
        :rules="[ val => val && val > 99 || 'The amount field should atleast 100']"
         />
      <div>
        <q-btn label="Confirm" padding="md sm" type="submit"  color="primary" class="full-width btn-submit"/>
      </div>
    </q-form>
    </div>
    <q-dialog v-model="askDialog">
      <q-card class="q-pb-lg q-pt-lg" style="width:400px;">
        <q-card-section class="q-mb-md">
          <h5 class="text-center q-mt-none">Transaction Preview.</h5>
          <div class="q-px-lg">
            <div class="row">
            <div class="col-4">
              <div class="text-subtitle2">Biller</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ biller?.name }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Service #</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction?.service_number }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Phone #</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction?.number }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Amount</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction.amount }}</div>
            </div>
          </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-pa-none q-mb-md row justify-evenly">
          <q-btn class="app-dialog-button-padding btn-rounded"  outline label="No" padding="sm xl" color="primary" @click="cancel" />
          <q-btn class="app-dialog-button-padding btn-rounded" label="Continue" padding="sm xl" color="primary" @click="onYes" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transactionDialog" persistent>
      <q-card class="q-pb-lg q-pt-sm" style="width:400px;">
        <q-card-section class="q-pa-none">
          <h5 align="center" v-if="isCreatingTransaction">Transaction In Progress.</h5>
          <h5 align="center" v-else>Transaction Completed.</h5>
          <div class="q-px-lg">
            <div class="row">
            <div class="col-4">
              <div class="text-subtitle2">Biller</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ biller?.name }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Service Number</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction?.service_number }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Phone Number</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction?.number }}</div>
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
          <q-btn color="positive" label="Send Feedback" class="full-width q-mb-sm" outline @click="setFeedbackDialog(true)"/>
          <q-btn color="primary" label="Close" class="full-width" @click="onFinishTransaction"/>
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
    <q-dialog v-model="feedbackDialog" persistent >
      <q-card class="q-px-lg q-pb-lg" style="min-width:640px">
        <q-card-section class="q-pt-lg flex justify-between align-center">
          <div class="text-h5 text-weight-regular no-margin">Feedback</div>
        </q-card-section>
        <q-form @submit="submitFeedback" ref="feedbackForm">
          <q-card-section>
            <q-input
              v-model="message"
              type="textarea"
              label="Message"
              outlined
              lazy-rules
              :rules="[val => !!val || 'Message is required.']"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" outline label="Close" padding="sm lg" @click="setFeedbackDialog(false)"/>
            <q-btn type="submit" color="primary" label="Submit" padding="sm lg"/>
          </q-card-actions>
         </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Biller',
  data: () => ({
    transaction: {
      unit_id: null,
      biller_id: null,
      biller_name: null,
      account_id: null,
      service_number: null,
      number: null,
      amount: 0
    },
    usingBalance: false,
    message: null,
    fetching: false
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
      isCreatingTransaction: 'transactions/isCreatingTransaction',
      feedbackDialog: 'feedbacks/getDialogState'
    })
  },
  methods: {
    ...mapActions({
      useAccountBalance: 'accounts/USE_ACCOUNT_BALANCE',
      finishTransaction: 'transactions/FINISH_TRANSACTION',
      confirm: 'transactions/CONFIRM',
      setFeedbackDialog: 'feedbacks/SET_DIALOG_STATE',
      createFeedback: 'feedbacks/CREATE_FEEDBACK',
      cancel: 'transactions/CANCEL'
    }),
    async onYes () {
      this.$store.commit('transactions/SET_ASK_DIALOG_STATUS', false)
      await this.$store.dispatch('accounts/GET_ACCOUNT_OR_CREATE', {
        biller_id: this.biller.id,
        service_number: this.transaction.service_number
      }).then((response) => {
        console.log(response)
        if (response) {
          this.transaction.account_id = this.account.id
          this.transaction.amount = parseFloat(this.transaction.amount) + parseFloat(this.setting.fee)
          this.$store.commit('transactions/SET_TRANSACTION_INFO', this.transaction)
          this.$store.commit('transactions/SET_PAYMENT_DIALOG_STATUS', true)
        }
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
    },
    onFinishTransaction () {
      this.finishTransaction()
      this.$router.push({
        name: 'billers'
      })
    },
    submitFeedback () {
      this.createFeedback({
        unit_id: this.unitId,
        account_id: this.account.id,
        message: this.message
      }).then(() => {
        this.setFeedbackDialog(false)
        this.finishTransaction()
        this.$router.push({
          name: 'billers'
        })
        Notify.create({
          position: 'top',
          type: 'positive',
          message: 'Thanks for submitting feedback.'
        })
      })
    }
  },
  async mounted () {
    this.fetching = true
    try {
      await this.$store.dispatch('billers/getBillerById', this.$route.params.id)
      await this.$store.dispatch('settings/getSetting')
      this.$store.commit('layout/SET_HEADER', this.biller.name)
      this.transaction.unit_id = this.unitId
      this.transaction.biller_id = this.biller.id
      this.transaction.biller_name = this.biller.name
    } catch (error) {}
    this.fetching = false
  }
}
</script>

<style lang="scss">
  .btn-submit {
    padding: 16px 0px;
  }
</style>
