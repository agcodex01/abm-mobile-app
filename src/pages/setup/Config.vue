<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <q-form
          @submit="onSave"
          @reset="onReset"
          class="q-gutter-md"
        >
        <q-input v-model="unitId" type="text" label="UUID" stack-label placeholder="Enter unit uuid here..." />
        <q-input v-model="token" type="text" label="Token" stack-label placeholder="Enter unit token here..." />
          <div class="q-gutter-sm">
            <q-btn label="Save" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="negative" outline />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    unitId: '',
    token: ''
  }),
  methods: {
    ...mapActions({
      setConfig: 'units/SET_CONFIG'
    }),
    onSave () {
      this.setConfig({
        unitId: this.unitId,
        token: this.token
      })
      this.$q.notify({
        position: 'top',
        type: 'positive',
        message: 'Config saved succcessfully.'
      })
    },
    onReset () {
      this.unitId = ''
      this.setConfig({
        unitId: null,
        token: null
      })
    }
  },
  computed: {
    ...mapGetters({
      storeUnitId: 'units/getUnitId',
      storeToken: 'units/getToken'
    })
  },
  mounted () {
    this.$store.commit('layout/SET_HEADER', 'Unit Config')
    this.unitId = this.storeUnitId
    this.token = this.storeToken
  }
}
</script>
