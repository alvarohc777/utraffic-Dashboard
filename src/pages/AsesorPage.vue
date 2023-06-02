<template>
  <q-page-container>
    <q-page>

      <div class="row justify-around items-center q-py-md center-card" style=" align-items: stretch;">


        <q-card style="flex-direction: column; justify-content: space-between; width: 250px;">
          <q-card-section>
            <div class="text-h5 text-purple-10">{{ asesor }}</div>
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
            <!-- <semi-circular :progress="score * 100 / 5" :title="'Calificación'" :score="score" :key="score" /> -->
          </q-card-section>

        </q-card>

        <div class="row justify-evenly" style="flex-grow: 1; " :clienteLinks="true">
          <q-card class=" row justify-between column" style="width: 350px; align-items: center;">
            <date-time-x :series="timeSeries" width="100%"></date-time-x>
            <apex-donut :data="credits" width="90%" />
          </q-card>
        </div>
        <solicitud-card :cliente="credit" v-for=" credit in  credits " :key="credit" />
      </div>

      <!-- <q-card class="row justify-evenly center-card">
        <date-time-x :series="timeSeries" width="140%"></date-time-x>
        <apex-donut :data="creditsFiltered" width="100%" />
        <apex-bar width="140%" :categories="dataBar[0]" :series="dataBar[1]" />
        <column-markers v-if="paymentMonths.length !== 0" width="140%" :series="seriesColumnMarkers" />
        <column-stacked v-if="paymentMonths.length !== 0" width="140%" :series="columnStackedSeries"
          :categories="paymentMonths" />
      </q-card> -->

      <div style="max-width: 100%; justify-content: center;" class="row center-card">
        <filter-table :data="creditsFiltered" :columns="columns" :clienteLinks="true">
          <template #category-selector>
            <q-select v-model="cliente" outlined dense options-dense label="Cuenta" emit-value map-options
              :options="clientes" option-value="name" options-cover style="min-width: 120px"></q-select>
          </template>
        </filter-table>
      </div>


    </q-page>
  </q-page-container>
</template>

<style></style>

<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from 'vue';



// Store
import { useIdsStore } from 'src/stores/tableId';
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
const store = useIdsStore();
const { asesorId } = storeToRefs(store)
// ------------------------------------------ |

// Scripts and uitls
import { jsonTransform } from 'src/scripts/jsonTransforms';
import { createFilterData, selectFilter, formattedTotal } from 'src/scripts/utils';
import { projection, datePaySeriesCreate, pagos, totalByMonth } from 'src/scripts/paymentInfo';
import { totalByCategory, datesCreator, datesByMonth, goalsAdd, seriesCreator } from 'src/scripts/chartsSeries';

// Components
import FilterTable from 'src/components/FilterTable.vue';


// // Charts
import ApexDonut from 'src/components/Charts/ApexDonut.vue';
import DateTimeX from 'src/components/Charts/DateTimeX.vue';
import ApexBar from 'src/components/Charts/ApexBar.vue';
import ColumnMarkers from 'src/components/Charts/ColumnMarkers.vue';
import ColumnStacked from 'src/components/Charts/ColumnStacked.vue';
import SolicitudCard from 'src/components/SolicitudCard.vue';


// ------------------------------------------- |

const credits = ref([])
const creditsFiltered = ref([])
const cliente = ref(null)
const clientes = ref([])
const asesor = ref(null)


watchEffect(() => {
  selectFilter(credits, creditsFiltered, cliente, clientes, 'cliente')
});

const timeSeries = computed(() => {
  let projectionSeries = projection(creditsFiltered.value, 'paymentHistorical')
  projectionSeries = datePaySeriesCreate(projectionSeries)
  return [{ name: "Projection", type: 'area', data: projectionSeries }]
})

const dataBar = computed(() => {
  let categoryField = (cliente.value) ? 'asesor' : 'cliente'
  let [categories, series] = totalByCategory(creditsFiltered.value, categoryField, 'monto')
  return [categories, [{ name: 'Monto', data: series }]]
})

const seriesColumnMarkers = computed(() => {
  let projectionSeries = projection(creditsFiltered.value)
  let pagosSeries = pagos(creditsFiltered.value)
  projectionSeries = totalByMonth(projectionSeries)
  pagosSeries = totalByMonth(pagosSeries)

  console.log("--------------: ", pagosSeries)
  console.log("--------------: ", projectionSeries)
  return [{ name: 'Recaudado', data: goalsAdd(pagosSeries, projectionSeries) }]
})

const paymentMonths = computed(() => {
  let dates = datesCreator(creditsFiltered.value, 'paymentHistorical')
  dates = datesByMonth(dates)
  return dates
})

const columnStackedSeries = computed(() => {
  let series = []
  let names = []
  let category = (cliente.value) ? 'creditId' : 'cliente'
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

const total = computed(() => {
  let total = 0
  credits.value.forEach((credit) => {
    total += parseFloat(credit.monto)
  })
  return total
})

onMounted(() => {
  api
    .get(`credits?populate=businessadvisor&populate=customer&filters[businessadvisor][id][$eq]=${asesorId.value}`)
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
      asesor.value = credits.value[0].asesor
      createFilterData(credits, clientes, 'cliente')
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
  plazoColumn,
  mesesPagosColumns,
  progresoColumn,
  currentFeeColumn,
  pagoColumn,
  creditStatusColumn,
])



</script>
