<template>
  <div class="fullscreen bg-primary text-white  q-pa-md flex flex-center">
    <div class="fixed-top">
      <q-list bordered>
         <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar>
          <img
            src="~assets/logo.png"
            width="200px"
            height="200px"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold text-h5 h5">ADOPISOFT</q-item-label>
        <q-item-label  lines="1" class="text-white text-h6"
          >Billing Machine</q-item-label
        >
      </q-item-section>
      <q-item-section avatar  @click="$router.push({name: 'options'})">
          <q-avatar size="96px"  text-color="white" icon="settings" />
        </q-item-section>
    </q-item>
      </q-list>
    </div>
    <q-card
      class="bg-secondary flex flex-center border-white clickables"
      style="min-width:200px;min-height:200px"
      @click="gotoBillers">
      <q-card-section class="q-pa-lg">
        <div class="text-h4 text-weight-bold">Pay Bills</div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'LandingPage',
  methods: {
    gotoBillers () {
      this.$router.push({ name: 'billers' })
    }
  }
}
</script>

<style>
  .border-white {
    border: white 2px solid !important;
  }
</style>
