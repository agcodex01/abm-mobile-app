<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <q-form
          @submit="onSave"
          @reset="onReset"
          class="q-gutter-md"
        >
        <q-input v-model="unitId" type="text" label="UUID" stack-label placeholder="Enter Unit uuid here..." />
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
    unitId: ''
  }),
  methods: {
    ...mapActions({
      setUnitId: 'units/setUnitId'
    }),
    onSave () {
      this.setUnitId(this.unitId)
    },
    onReset () {
      this.unitId = ''
      this.setUnitId('')
    }
  },
  computed: {
    ...mapGetters({
      storeUnitId: 'units/getUnitId'
    })
  },
  mounted () {
    this.$store.commit('layout/SET_HEADER', 'Set Unit UUID')
    this.unitId = this.storeUnitId
  }
}
</script>
