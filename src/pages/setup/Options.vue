<template>
  <div class="q-pa-md q-gutter-md">
    <q-list bordered padding class="rounded-borders" >
      <q-item-label header>Device</q-item-label>

      <q-item clickable v-ripple :to="{name: 'set_device_uuid'}">
        <q-item-section avatar top>
          <q-avatar icon="tablet" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Set Unit UUID</q-item-label>
          <q-item-label caption>This will be the bases where the transactions came from.</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" color="green" />
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item-label header>Transactions</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="assignment" color="grey" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">History</q-item-label>
          <q-item-label caption>March 2nd, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="place" color="grey" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Balances</q-item-label>
          <q-item-label caption>February 22, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="info" color="amber" />
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
