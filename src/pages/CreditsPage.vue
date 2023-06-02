<template>
  <q-page-container>

    <q-page>
      <q-card class="row justify-evenly center-card">
        <date-time-x :title="advisor" :series="timeSeries" width="140%" />
        <apex-donut :data="creditsFiltered" :title="advisor" width="100%" />
        <apex-bar-vue width="140%" :categories="dataBar[0]" :series="dataBar[1]" :title="advisor" />
        <column-markers v-if="paymentMonths.length !== 0" width="140%" :series="seriesColumnMarkers" :title="advisor" />
        <column-stacked v-if="paymentMonths.length !== 0" width="140%" :series="ColumnStackedSeries"
          :categories="paymentMonths" :title="advisor" />
      </q-card>


      <div class="row center-card">
        <filter-table :data="creditsFiltered" :columns="columns" :asesorLinks="true" :clienteLinks="true">
          <template #category-selector>
            <q-select v-model="advisor" outlined dense options-dense label="Cuenta" emit-value map-options
              :options="advisors" option-value="name" options-cover style="min-width: 120px"></q-select>
          </template>
        </filter-table>
      </div>
    </q-page>
  </q-page-container>
</template>
<style></style>


<script setup>

// Imports
import { onMounted, ref, reactive, watchEffect, computed } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useIdsStore } from 'src/stores/tableId'

const store = useIdsStore();


// Store
// import { useIdsStore } from 'src/stores/tableId'
// const prueba = useIdsStore()

// // Components
import FilterTable from 'src/components/FilterTable.vue';
import ApexDonut from 'src/components/Charts/ApexDonut.vue';
import DateTimeX from 'src/components/Charts/DateTimeX.vue';
import ColumnMarkers from 'src/components/Charts/ColumnMarkers.vue'
import ColumnStacked from 'src/components/Charts/ColumnStacked.vue';
import ApexBarVue from 'src/components/Charts/ApexBar.vue';
// Scripts and uitls
import { jsonTransform } from 'src/scripts/jsonTransforms';
import { createFilterData, selectFilter } from 'src/scripts/utils';
import { projection, datePaySeriesCreate, pagos, totalByMonth } from 'src/scripts/paymentInfo';
import { totalByCategory, datesCreator, datesByMonth, goalsAdd, seriesCreator } from 'src/scripts/chartsSeries';


// Esto debe settearse al iniciar sesión
let $q = useQuasar();
$q.sessionStorage.set(
  "finansofttoken",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg0ODUzNDkxLCJleHAiOjE2ODc0NDU0OTF9.1bxW_sbUbzNqIwPMXaDRkeIu__GIrk3LBZUENilkI5A"
);
$q.sessionStorage.set("asesorId", '1')

const credits = ref([]);
const creditsFiltered = ref([])
const advisors = ref([]);
const advisor = ref(null);

// Computed Properties

const seriesColumnMarkers = computed(() => {
  let projectionSeries = projection(creditsFiltered.value)
  let pagosSeries = pagos(creditsFiltered.value)
  projectionSeries = totalByMonth(projectionSeries)
  pagosSeries = totalByMonth(pagosSeries)

  return [{ name: 'Recaudado', data: goalsAdd(pagosSeries, projectionSeries) }]
})


const dataBar = computed(() => {
  let categoryField = (advisor.value) ? 'cliente' : 'asesor'
  let [categories, series] = totalByCategory(creditsFiltered.value, categoryField, 'monto')
  return [categories, [{ name: 'Monto', data: series }]]
})

const timeSeries = computed(() => {

  let projectionSeries = projection(creditsFiltered.value)
  projectionSeries = datePaySeriesCreate(projectionSeries)

  return [{ name: "Projection", type: 'area', data: projectionSeries }]
})

watchEffect(() => {
  selectFilter(credits, creditsFiltered, advisor, advisors, 'asesor')
});

const paymentMonths = computed(() => {
  // console.log("new Json recursive: ", creditsFiltered.value)
  let dates = datesCreator(creditsFiltered.value, 'paymentHistorical')
  dates = datesByMonth(dates)
  return dates
})

const ColumnStackedSeries = computed(() => {
  let series = []
  let names = []
  let category = (advisor.value) ? 'cliente' : 'asesor'
  creditsFiltered.value.forEach((credit) => {
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
    .get('/credits?populate=customer&populate=businessadvisor')
    .then((res) => {

      // credits.value = jsonClientes(res.data.data)

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

      console.log("Original: ", res.data.data)
      credits.value = jsonTransform(res.data.data, keysToFind)
      createFilterData(credits, advisors, 'asesor')
      console.log("new Json recursive: ", credits.value)

    })
    .catch((err) => console.log(err.message));
})

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
