<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="chevron_left"
          aria-label="Menu"
          @click="$router.back"
        />
        <q-toolbar-title v-text="header" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MainLayout',
  computed: {
    ...mapGetters({
      header: 'layout/getHeader'
    })
  }
}
</script>
