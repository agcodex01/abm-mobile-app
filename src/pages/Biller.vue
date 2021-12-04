<template>
  <q-page padding class="q-mx-auto q-mt-none">
    <div v-if="fetching" class="text-center">
      <h4>Fetching...</h4>
      <q-skeleton type="rect" height="60px" class="q-mb-md" v-for="n in 4" :key="n" />
    </div>
    <div v-else-if="!fetching && !biller">
      <q-btn color="primary" label="Back to billers" :to="{name: 'billers'}" />
      <h4>Service unavailable.</h4>
    </div>
    <div v-else>
      <h6 class="text-center">Transaction Fee : ₱ {{ setting?.fee }}</h6>
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
            type="number"
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
      <q-card class="q-pb-lg" style="width:400px;">
        <q-card-section class="q-mb-md">
          <p class="text-center text-subtitle1 text-weight-bold q-mt-none">Transaction Preview.</p>
          <div class="q-px-lg">
            <div class="row">
            <div class="col-4">
              <div class="text-subtitle2">Biller</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ biller?.name }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Account #</div>
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
              <div class="text-subtitle2">: ₱ {{ transaction.amount }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Fee</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: ₱ {{ setting.fee }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Total</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: ₱ {{ getTotal }}</div>
            </div>
          </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-pa-none row justify-evenly">
          <q-btn class="btn-rounded"  outline label="No" padding="sm xl" color="primary" @click="cancel" />
          <q-btn class="btn-rounded" label="Continue" padding="sm xl" color="primary" @click="onYes" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transactionDialog" persistent>
      <q-card class="q-pb-lg q-pt-none" style="width:400px;">
        <q-card-section class="q-pa-none">
          <h6 class="text-center q-my-md" v-if="isCreatingTransaction && !serviceNotAvailable">Transaction In Progress.</h6>
          <h6 class="text-center q-my-md" v-else-if="!isCreatingTransaction && serviceNotAvailable">Transaction In Progress.</h6>
          <h6 class="text-center q-my-md" v-else>Transaction Completed.</h6>
          <div class="q-px-lg">
            <div class="row">
            <div class="col-4">
              <div class="text-subtitle2">Biller</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ biller?.name }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Account #</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: {{ transaction?.service_number }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Balance</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: ₱ {{ account?.balance }}</div>
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
              <div class="text-subtitle2">: ₱ {{ transaction.amount }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Payment Inserted</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: ₱ {{ insertedPayment }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Fee</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: ₱ {{ setting.fee }}</div>
            </div>
            <div class="col-4">
              <div class="text-subtitle2">Total</div>
            </div>
            <div class="col-8">
              <div class="text-subtitle2">: ₱ {{ getTotal }}</div>
            </div>
          </div>
          </div>
        </q-card-section>
        <q-card-section class="text-center" v-show="isCreatingTransaction">
          <q-spinner-ios color="primary" size="3em"/>
           <p>Creating transaction in progress...</p>
        </q-card-section>
        <q-card-section class="text-center" v-show="!isCreatingTransaction && serviceNotAvailable">
           <p class="text-subtitle2">Transaction Failed</p>
           <q-btn color="primary" outline label="Retry" class="full-width" @click="retryTransaction" />
           <q-btn color="primary" label="Back to billers" class="full-width q-mt-sm" :to="{name: 'billers'}" />
        </q-card-section>
        <q-card-section class="text-center" v-show="!isCreatingTransaction && !serviceNotAvailable">
          <q-icon name="task_alt" size="64px" color="positive" />
          <p class="q-mt-md">Sms message will be sent to your mobile number for confirmation.</p>
          <q-btn color="positive" label="Send Feedback" class="full-width q-mb-sm" outline @click="setFeedbackDialog(true)"/>
          <q-btn color="primary" label="Close" class="full-width" @click="onFinishTransaction"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentDialog" persistent >
      <q-card class="q-px-lg q-pb-lg">
        <q-card-section class="q-pt-lg">
          <div class="text-h5 text-weight-regular no-margin text-center">Insert Payment</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Amount </div>
             <div class="text-subtitle1" style="font-size:24px">₱ {{ getTotal|| 0 }} </div>
          </div>
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Balance </div>
             <div class="text-subtitle1 q-mb-md" style="font-size:24px">₱ {{ account.balance || 0 }} </div>
          </div>
          <div class="col-4 text-center">
             <div class="text-h6 q-mb-md">Payment </div>
             <div class="text-subtitle1" style="font-size:24px">₱ {{ insertedPayment }} </div>
          </div>
          <div class="col-12 q-mt-lg">
            <div class="text-center q-mb-lg" v-show="isInsertingPayment">
                <q-spinner-ios color="primary" size="3em"/>
                <p>Inserting payment in progress...</p>
            </div>
          </div>
          <q-btn color="negative" outline label="Cancel" class="full-width" @click="cancelTransactionOptionFn" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="feedbackDialog" persistent >
      <q-card class="q-pb-lg">
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
    <q-dialog v-model="cancelTransactionDialog" persistent >
      <q-card class="q-pb-lg">
        <q-card-section class="q-pt-lg flex justify-between align-center">
          <div class="text-h5 text-weight-regular no-margin">Cancel Transaction</div>
        </q-card-section>
        <q-card-section>
          Are you sure you want to cancel transaction ? The inserted money will become your balance in the selected biller.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" outline label="Close" padding="sm lg" @click="cancelTransactionDialog = false"/>
          <q-btn color="primary" :loading="isCancelTransactionLoading" label="Continue" padding="sm lg" @click="cancelTransactionFn"/>
        </q-card-actions>
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
      amount: 100,
      status: 'pending'
    },
    usingBalance: false,
    message: null,
    fetching: false,
    cancelTransactionDialog: false
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
      feedbackDialog: 'feedbacks/getDialogState',
      serviceNotAvailable: 'transactions/getServiceNotAvailable',
      isCancelTransactionLoading: 'transactions/getCancelTransactionLoading',
      transactionData: 'transactions/getTransaction'
    }),
    getTotal () {
      return parseInt(this.setting.fee) + parseInt(this.transaction.amount)
    }
  },
  methods: {
    ...mapActions({
      useAccountBalance: 'accounts/USE_ACCOUNT_BALANCE',
      finishTransaction: 'transactions/FINISH_TRANSACTION',
      confirm: 'transactions/CONFIRM',
      setFeedbackDialog: 'feedbacks/SET_DIALOG_STATE',
      createFeedback: 'feedbacks/CREATE_FEEDBACK',
      cancel: 'transactions/CANCEL',
      cancelTransaction: 'transactions/CANCEL_TRANSACTION'
    }),
    async onYes () {
      this.$store.commit('transactions/SET_ASK_DIALOG_STATUS', false)
      await this.$store.dispatch('accounts/GET_ACCOUNT_OR_CREATE', {
        biller_id: this.biller.id,
        service_number: this.transaction.service_number
      }).then((response) => {
        if (response) {
          this.transaction.account_id = this.account.id
          this.$store.commit('transactions/SET_TRANSACTION_INFO', this.transaction)
          this.$store.commit('transactions/SET_PAYMENT_DIALOG_STATUS', true)
          this.onUseAccountBalance()
        }
      })
    },
    async onUseAccountBalance () {
      this.usingBalance = true
      let insertFromBalance = 0
      const total = parseInt(this.transaction.amount) + parseInt(this.setting.fee)
      if (this.account.balance >= this.transaction.amount) {
        this.$store.commit('accounts/SET_ACCOUNT_BALANCE', parseInt(this.account.balance) - total)
        insertFromBalance = total
      } else {
        insertFromBalance = parseInt(this.account.balance || 0)
      }

      this.$store.dispatch('transactions/ADD_PAYMENT', insertFromBalance)
      this.usingBalance = false
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
    },
    cancelTransactionOptionFn () {
      if (this.insertedPayment > 0) {
        this.cancelTransactionDialog = true
      } else {
        this.$store.dispatch('transactions/CANCEL_TRANSACTION_MODAL')
      }
    },
    async cancelTransactionFn () {
      this.transaction.status = 'cancelled'
      this.transaction.insertedAmount = this.insertedPayment
      await this.cancelTransaction(this.transaction)
      Notify.create({
        position: 'top',
        type: 'positive',
        message: 'Cancelling transaction done.'
      })
      this.$router.push({
        name: 'billers'
      })
    },
    async retryTransaction () {
      this.$store.commit('transactions/SET_SERVICE_NOT_AVAIALABLE', false)
      this.$store.dispatch('transactions/CREATE_TRANSACTION', this.transactionData)
    }
  },
  async mounted () {
    this.fetching = true
    try {
      this.finishTransaction()
      this.$store.dispatch('transactions/CANCEL_TRANSACTION_MODAL')
      this.$store.commit('transactions/SET_PAYMENT', 0)
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
