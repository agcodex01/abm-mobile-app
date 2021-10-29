<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  mounted () {
    this.$socket.on('insertPayment', (amount) => {
      console.log('AMOUNT INSERTED', amount)
      this.$store.dispatch('transactions/ADD_PAYMENT', amount)
    })
  }
})
</script>
