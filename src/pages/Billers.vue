<template>
  <q-page class="q-pa-xl">
    <q-input
      v-model="billerSearch"
      type="search"
      label="Search biller here..."
      outlined
      @keyup="searchBiller(billerSearch)">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list separator class="q-mt-lg">
         <q-item
          v-for="biller in billers"
          :key="biller.id"
          class="q-my-sm"
          clickable
          v-ripple
          :to="{
            name: 'select_biller',
            params: {id: biller.id}
          }">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ biller.type[0].toUpperCase() }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ biller.name }}</q-item-label>
          <q-item-label caption lines="1">{{ biller.description }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
      </q-list>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Billers',
  data: () => ({
    billerSearch: ''
  }),
  methods: {
    ...mapActions({
      selectBiller: 'billers/selectBiller',
      searchBiller: 'billers/setNewStringSearch'
    })
  },
  computed: {
    ...mapGetters({
      billers: 'billers/getBillers'
    })
  },

  async mounted () {
    this.$store.commit('layout/SET_HEADER', 'Billers')
    this.$q.loading.show()
    await this.$store.dispatch('billers/getBillers')
    this.$q.loading.hide()
  }
}
</script>
