<template>
  <div class="fullscreen bg-primary text-white flex flex-center">
    <div class="fixed-top">
      <q-list bordered>
         <q-item class="padding-none">
      <q-item-section avatar>
        <q-avatar>
          <img
            src="~assets/logo.png"
            width="50px"
            height="50px"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold text-subtitle1">ADOPISOFT</q-item-label>
        <q-item-label  lines="1" class="text-white text-subtitle2"
          >Billing Machine</q-item-label
        >
      </q-item-section>
      <q-item-section avatar  @click="openLogin">
          <q-avatar size="64px"  text-color="white" icon="settings" />
        </q-item-section>
    </q-item>
      </q-list>
    </div>
    <q-card
      class="bg-secondary flex flex-center border-white clickables"
      @click="gotoBillers">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-weight-bold">Pay Bills</div>
      </q-card-section>
    </q-card>
    <div class="fixed-bottom text-center">
      <p>© 2021 Adopisoft. All rights reserved</p>
    </div>
    <q-dialog v-model="loginDialog" persistent>
      <q-card style="width:75%">
        <q-card-section class="flex justify-between align-center">
          <span class="text-weight-bold">Authenticate</span>
          <q-btn size="sm" icon="close" flat v-close-popup/>
        </q-card-section>
        <q-card-section>
          <q-form ref="loginForm" class="q-gutter-md">
            <q-input
              v-model="credentials.email"
              type="email"
              label="Email"
              dense
              outlined
              autocomplete="false"
              hint="Portal email credential."
              :error="authErrors.email.error"
              :error-message="authErrors.email.message"
              :rules="[
                val => !!val || 'Email is required.'
              ]"
            />
           <q-input
            v-model="credentials.password"
            type="password"
            label="Password"
            dense
            outlined
            autocomplete="false"
            aria-autocomplete="false"
            :error="authErrors.password.error"
            :error-message="authErrors.password.message"
            :rules="[
              val => !!val || 'Password is required.'
            ]"
          />
          </q-form>
        </q-card-section>
        <q-card-actions class="q-mb-md">
          <q-btn label="Login" color="primary" class="full-width" :loading="loading"  @click="login">
            <template v-slot:loading>
              <q-spinner class="on-left" />
                Signing In...
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LandingPage',
  data: () => ({
    footer: true,
    loginDialog: false,
    credentials: {
      email: null,
      password: null
    },
    authErrors: {
      email: {
        error: false,
        message: ''
      },
      password: {
        error: false,
        message: ''
      }
    }
  }),
  computed: {
    ...mapGetters({
      loading: 'auth/getLoading'
    })
  },
  methods: {
    ...mapActions({
      authenticate: 'auth/login'
    }),
    gotoBillers () {
      this.$router.push({ name: 'billers' })
    },
    openLogin () {
      this.loginDialog = true
      this.credentials.email = null
      this.credentials.password = null
    },
    login () {
      this.$refs.loginForm.validate().then(async isValid => {
        if (isValid) {
          Object.keys(this.authErrors).forEach(key => {
            this.authErrors[key].error = false
            this.authErrors[key].message = ''
          })
          await this.authenticate(this.credentials)
            .then((data) => {
              this.$router.push({
                name: 'options'
              })
              Notify.create({
                type: 'positive',
                position: 'top',
                message: `Successfully login as ${data.user.name}`
              })
            }).catch(errors => {
              Object.keys(this.authErrors).forEach(key => {
                if (key in errors) {
                  this.authErrors[key].error = true
                  this.authErrors[key].message = errors[key][0]
                }
              })
            })
        }
      })
    }
  }
}
</script>

<style>
  .border-white {
    border: white 2px solid !important;
  }
</style>
