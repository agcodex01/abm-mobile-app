<template>
  <div class="q-pa-md q-gutter-md">
    <q-table
      title="Transaction Logs"
      no-data-label="There is no Logs as of now!"
      no-results-label="The filter didn't find any Logs"
      class="q-mt-lg"
      row-key="id"
      :rows="transactions"
      :columns="tableHeader"
    >
    <template v-slot:body-cell-status="props">
          <q-td :props="props" >
            <q-badge :color="colorSetter(props.row.status)" class="q-pa-xs">
              {{ props.row.status }}
            </q-badge>
          </q-td>
      </template>
    <template v-slot:body-cell-biller_name="props">
              {{ props.row.biller_name }}
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Transactions',
  computed: {
    ...mapGetters({
      tableHeader: 'transactions/getTableHeader',
      transactions: 'transactions/getLogs'
    })
  },
  mounted () {
    this.$store.commit('layout/SET_HEADER', 'History Logs')
  },
  methods: {
    colorSetter (status) {
      switch (status) {
        case 'Success':
          return 'positive'
        case 'Failed':
          return 'negative'
      }
    }
  }
}
</script>
