<template>
  <q-page-container>
    <q-page>


      <!-- Se le pasa credits, cliente -->
      <div class="row justify-around items-center q-py-md center-card" style=" align-items: stretch;">

        <q-card style="flex-direction: column; justify-content: space-between; width: 250px;">
          <q-card-section>
            <div class="text-h5 text-purple-10">{{ cliente }}</div>
          </q-card-section>

          <q-card-section class="row justify-between">
            <div>
              <p style="margin: 0px" class="text-purple-10">
                <strong> Créditos: </strong>
              </p>
              <div v-for="credit in credits" :key="credit">
                {{ credit.creditId }}
              </div>
            </div>
            <img src="../../src/assets/profileIcon.png" style="width: 70px; height: 70px" />
          </q-card-section>

          <q-card-section>
            <p style="margin: 0px" class="text-purple-10">
              <strong> Total: </strong>
            </p>
            <p class="text-subtitle2">{{ formattedTotal.format(total) }}</p>



            <semi-circular :progress="score * 100 / 5" :title="'Calificación'" :score="score" :key="score" />
          </q-card-section>

        </q-card>

        <div class="row justify-evenly" style="flex-grow: 1; ">
          <q-card class=" row justify-between column" style="width: 350px; align-items: center;">
            <date-time-x :series="timeSeries" width="100%"></date-time-x>
            <apex-donut :data="credits" width="90%" />
          </q-card>
        </div>
        <solicitud-card :cliente="credit" v-for=" credit in  credits " :key="credit" />
      </div>





      <!-- <q-card class="row  center-card">
        <date-time-x :series="timeSeries" :title="cliente" width="140%"></date-time-x>
        <apex-donut :data="credits" :title="cliente" width="100%" />
        <apex-bar width="140%" :categories="dataBar[0]" :series="dataBar[1]" :title="asesor" />
        <column-markers v-if="paymentMonths.length !== 0" width="140%" :series="seriesColumnMarkers" :title="cliente" />
        <column-stacked v-if="paymentMonths.length !== 0" width="140%" :series="columnStackedSeries"
          :categories="paymentMonths" :title="cliente" />
      </q-card> -->

      <div class="row  center-card">
        <filter-table :data="credits" :columns="columns" :asesorLinks="true" />
      </div>


    </q-page>
  </q-page-container>
</template>

<style>
.center-card {
  max-width: 97%;
  margin-left: 1.5%;
  justify-content: center;
}
</style>

<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from 'vue';

// Scripts
import { projection, datePaySeriesCreate, pagos, totalByMonth } from 'src/scripts/paymentInfo';
import { totalByCategory, datesCreator, datesByMonth, goalsAdd, seriesCreator } from 'src/scripts/chartsSeries';
import { formattedTotal } from 'src/scripts/utils';


// components
import FilterTable from 'src/components/FilterTable.vue';
import ApexDonut from 'src/components/Charts/ApexDonut.vue';
import DateTimeX from 'src/components/Charts/DateTimeX.vue';
import ApexBar from 'src/components/Charts/ApexBar.vue';
import ColumnMarkers from 'src/components/Charts/ColumnMarkers.vue';
import ColumnStacked from 'src/components/Charts/ColumnStacked.vue';
import SemiCircular from 'src/components/Charts/SemiCircular.vue';
import SolicitudCard from 'src/components/SolicitudCard.vue';

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
const score = ref(null)


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

const total = computed(() => {
  let total = 0
  credits.value.forEach((credit) => {
    total += parseFloat(credit.monto)
  })
  return total
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
      ['paymentPlan', 'payment_plan'],
      ['score', 'customer', 'score']
      ]
      console.log("new Json recursive: ", res.data.data)
      credits.value = jsonTransform(res.data.data, keysToFind)
      cliente.value = credits.value[0].cliente
      score.value = credits.value[0].score
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
  // clienteColumn,
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
