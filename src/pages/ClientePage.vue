<template>
  <q-page-container>
    <q-page>

      <q-card class="row justify-evenly">
        <date-time-x :series="timeSeries" :title="cliente" width="140%"></date-time-x>
        <apex-donut :data="credits" :title="cliente" width="140%" />
        <apex-bar width="140%" :categories="dataBar[0]" :series="dataBar[1]" :title="asesor" />
        <column-markers v-if="paymentMonths.length !== 0" width="140%" :series="seriesColumnMarkers" :title="cliente" />
        <column-stacked v-if="paymentMonths.length !== 0" width="140%" :series="columnStackedSeries"
          :categories="paymentMonths" :title="cliente" />
      </q-card>

      <div style="max-width: 100%; justify-content: center;" class="row">
        <filter-table :data="credits" :columns="columns" />
      </div>

    </q-page>
  </q-page-container>
</template>

<style></style>

<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from 'vue';

// Scripts
import { projection, datePaySeriesCreate, pagos, totalByMonth } from 'src/scripts/paymentInfo';
import { totalByCategory, datesCreator, datesByMonth, goalsAdd, seriesCreator } from 'src/scripts/chartsSeries';

// components
import FilterTable from 'src/components/FilterTable.vue';
import ApexDonut from 'src/components/Charts/ApexDonut.vue';
import DateTimeX from 'src/components/Charts/DateTimeX.vue';
import ApexBar from 'src/components/Charts/ApexBar.vue';
import ColumnMarkers from 'src/components/Charts/ColumnMarkers.vue';
import ColumnStacked from 'src/components/Charts/ColumnStacked.vue';

// Store
import { useIdsStore } from 'src/stores/tableId';
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { jsonTransform } from 'src/scripts/jsonTransforms';

const store = useIdsStore();
const { clienteId } = storeToRefs(store)
// ------------------------------------------ |


const credits = ref([])
const cliente = ref(null)


const timeSeries = computed(() => {
  let projectionSeries = projection(credits.value, 'paymentHistorical')
  projectionSeries = datePaySeriesCreate(projectionSeries)
  return [{ name: "Projection", type: 'area', data: projectionSeries }]
})

const dataBar = computed(() => {
  let categoryField = (cliente.value) ? 'creditId' : 'cliente'
  let [categories, series] = totalByCategory(credits.value, categoryField, 'monto')
  return [categories, [{ name: 'Monto', data: series }]]
})

const seriesColumnMarkers = computed(() => {
  let projectionSeries = projection(credits.value)
  let pagosSeries = pagos(credits.value)
  projectionSeries = totalByMonth(projectionSeries)
  pagosSeries = totalByMonth(pagosSeries)

  console.log("--------------: ", pagosSeries)
  console.log("--------------: ", projectionSeries)
  return [{ name: 'Recaudado', data: goalsAdd(pagosSeries, projectionSeries) }]
})

const paymentMonths = computed(() => {
  let dates = datesCreator(credits.value, 'paymentHistorical')
  dates = datesByMonth(dates)
  return dates
})

const columnStackedSeries = computed(() => {
  let series = []
  let names = []
  let category = (cliente.value) ? 'creditId' : 'cliente'
  credits.value.forEach((credit) => {
    if (!names.includes(credit[category])) {
      names.push(credit[category])
      series.push({
        name: credit[category],
        data: seriesCreator(credit, 'paymentHistorical', paymentMonths.value)
      })
    } else {
      let idx = names.indexOf(credit[category])
      let oldValues = series[idx].data
      let newValues = seriesCreator(credit, 'paymentHistorical', paymentMonths.value)
      let sum = oldValues.map((num, idx) => {
        return num + newValues[idx]
      })
      series[idx].data = sum
    }
  })
  console.log("names: ", names)
  return series
})

onMounted(() => {
  api
    .get(`credits?populate=businessadvisor&populate=customer&filters[customer][id][$eq]=${clienteId.value}`)
    .then((res) => {
      let keysToFind = [['creditId', 'credit_id'],
      ['id', 'id'],
      ['cliente', 'customer', 'full_name'],
      ['clienteId', 'customer', 'id'],
      ['monto', 'amount'],
      ['plazo', 'term'],
      ['fechaSolicitud', 'applicationdate'],
      ['calificacion', 'score'],
      ['asesor', 'businessadvisor', 'full_name'],
      ['asesorId', 'businessadvisor', 'id'],
      ['paymentHistorical', 'payment_historical'],
      ['campoInexistente', 'campoInexistente'],
      ['paymentFee', 'payment_fee'],
      ['paymentPlan', 'payment_plan']
      ]
      console.log("new Json recursive: ", res.data.data)
      credits.value = jsonTransform(res.data.data, keysToFind)
      cliente.value = credits.value[0].cliente
      console.log("new Json recursive: ", credits.value)
    })
    .catch((err) => console.log(err.message))
})


// Columns

import {
  nSolicitudColumn,
  clienteColumn,
  montoColumn,
  fechaSolicitudColumn,
  calificacionColumn,
  asesorColumn,
  plazoColumn,
  mesesPagosColumns,
  progresoColumn,
  currentFeeColumn,
  pagoColumn,
  creditStatusColumn,
} from 'src/scripts/columns'

const columns = reactive([
  nSolicitudColumn,
  clienteColumn,
  montoColumn,
  fechaSolicitudColumn,
  calificacionColumn,
  asesorColumn,
  plazoColumn,
  mesesPagosColumns,
  progresoColumn,
  currentFeeColumn,
  pagoColumn,
  creditStatusColumn,
])

</script>
