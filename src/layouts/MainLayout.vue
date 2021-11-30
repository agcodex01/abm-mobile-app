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
          @click="redirectTo"
          v-if="$route.name !== 'options'"
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
  methods: {
    redirectTo () {
      this.$router.push({
        name: this.$route.meta.redirectTo
      })
    }
  },
  computed: {
    ...mapGetters({
      header: 'layout/getHeader'
    })
  }
}
</script>
