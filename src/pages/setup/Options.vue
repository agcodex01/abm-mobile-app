<template>
  <div class="q-pa-md q-gutter-md">
    <q-list bordered padding class="rounded-borders" >
      <q-item-label header>Device</q-item-label>

      <q-item clickable v-ripple :to="{name: 'set_device_config'}">
        <q-item-section avatar top>
          <q-avatar icon="tablet" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Config</q-item-label>
          <q-item-label caption>This will be the bases where the transactions came from.</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" color="green" />
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item-label header>Transactions</q-item-label>

      <q-item clickable v-ripple :to="{name: 'view_transaction_logs'}">
        <q-item-section avatar top>
          <q-avatar icon="assignment" color="grey" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">History</q-item-label>
          <q-item-label caption>Transaction logs</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
export default {
  mounted () {
    this.$store.commit('layout/SET_HEADER', 'Setup')
  }
}
</script>
