<template>
  <q-page-container>

    <q-page>
      <q-card class="row justify-evenly">
        <date-time-x :title="advisor" :series="timeSeries" width="140%" />
        <apex-donut :data="creditsFiltered" :title="advisor" width="100%" />
        <apex-bar-vue width="140%" :categories="dataBar[0]" :series="dataBar[1]" :title="advisor" />

        <column-markers v-if="paymentMonths.length !== 0" width="140%" :series="seriesColumnMarkers" :title="advisor" />
        <column-stacked v-if="paymentMonths.length !== 0" width="140%" :series="ColumnStackedSeries"
          :categories="paymentMonths" :title="advisor" />
        <!-- <column-negative width="140%" /> -->
      </q-card>
      <div style="max-width: 100%; justify-content: center;" class="row ">
        <filter-table :data="creditsFiltered" :columns="columns">
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
// // Scripts
import { datePaySeriesCreate, projection, pagos } from 'src/scripts/paymentInfo'
import { createFilterData, selectFilter, } from 'src/scripts/utils'
import { jsonTransform } from 'src/scripts/jsonTransforms'
import { totalByCategory } from 'src/scripts/chartsSeries';

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



// Ingresar dos diccionarios de forma {date: }
// Se obtienen de totalByMonth, retorna array de fechas con totales
const goalsAdd = (pagos, projection) => {
  let series = []
  Object.entries(pagos).forEach((entry) => {
    let date = entry[0]
    let pago = entry[1]
    let _ = {
      x: date,
      y: pago,
      goals: [{
        name: 'Proyectado',
        value: 0,
        strokeHeight: 5,
        strokeColor: '#775DD0'
      }]
    }
    if (entry[0] in projection) {
      let goal = projection[entry[0]]
      _.goals[0].value = goal
      series.push(_)
    }
    else {
      series.push(_)
    }

  })
  return series
}


const totalByMonth = (data) => {
  let obj = {}
  Object.entries(data).forEach((entry) => {
    if (entry[0].slice(0, 7) in obj) {
      obj[entry[0].slice(0, 7)] += entry[1]
    } else {
      obj[entry[0].slice(0, 7)] = entry[1]
    }
  })
  return obj
}

const datesCreator = (data, field) => {
  let dates = []
  data.forEach((entry) => {
    entry[field].forEach((payment) => {
      if (!dates.includes(payment.date)) {
        dates.push(payment.date)
      }
    })
  })

  return dates
}

const sortArray = (unsortedArray) => {
  let sortedArray = unsortedArray.sort((a, b) => {
    return a[0] - b[0];
  });
  return sortedArray
}

const datesByMonth = (dates) => {
  let datesByMonth = []
  dates.forEach((date) => {
    if (!datesByMonth.includes(date.slice(0, 7))) {
      datesByMonth.push(date.slice(0, 7))
    }
  })
  datesByMonth = sortArray(datesByMonth)
  return datesByMonth
}

const seriesCreator = (data, field, datesByMonth) => {

  let series = new Array(datesByMonth.length).fill(0);
  data[field].forEach((entry) => {
    let idx = datesByMonth.indexOf(entry.date.slice(0, 7))
    if (series[idx] === 0) {
      series[idx] = entry.amount
    } else {
      series[idx] += entry.amount
    }
  })
  return series
}


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







// Todo: exportar esto como componentes
const columns = reactive([
  {
    name: "nSolicitud",
    required: true,
    label: "N° Solicitud",
    align: "right",
    field: (row) => row.creditId,
    sortable: true,
  },
  {
    name: "cliente",
    required: true,
    label: "Cliente",
    align: "left",
    field: (row) => row.cliente,
    format: (val, row) => row.cliente,
    sortable: true,
  },
  {
    name: "monto",
    label: "Monto",
    field: (row) => row.monto,
    sortable: true,
    format: (val, row) => `${formattedTotal.format(row.monto)}`
  },

  {
    name: "fechaSolicitud",
    label: "Fecha solicitud",
    align: "right",
    field: (row) => row.fechaSolicitud,
    sortable: true
  },
  {
    name: "calificacion",
    required: true,
    label: "Calificacion",
    align: "left",
    field: (row) => row.calificacion,
    sortable: true,
    format: (val, row) => `${"\u2B50".repeat(row.calificacion)}`,
  },
  {
    name: "asesor",
    required: true,
    label: "Asesor",
    align: "left",
    field: (row) => row.asesor,
    sortable: true,
  },
  {
    name: "plazo",
    label: "Plazo (m)",
    align: "right",
    field: (row) => row.plazo,
    sortable: true,
  },
  {
    name: "mesesPagos",
    label: "Meses Pagos (m)",
    align: "right",
    field: (row) => mesesPagos(row.paymentFee),
    sortable: true,
  },
  {
    name: "progreso",
    label: "Progreso",
    align: "right",
    sortable: true,
    field: (row) => progressCalculator(row.paymentFee),
    format: (val, row) => {
      return `${(val * 100).toFixed(0)}%`
    }
  },
  {
    name: "currentFee",
    label: "Próximo Pago",
    align: "right",
    sortable: true,
    field: (row) => row.paymentFee,
    format: (val, row) => {
      let [date, _] = currentFee(val)
      return date
    }
  },
  {
    name: "currentPayment",
    label: "Pago",
    align: "right",
    sortable: true,
    field: (row) => row.paymentFee,
    format: (val, row) => {
      let [_, pago] = currentFee(val)
      return formattedTotal.format(pago)
    }
  },
  {
    name: "creditStatus",
    label: "Estado",
    align: "right",
    sortable: true,
    field: (row) => creditStatus(row.paymentFee),

  },



]);


</script>
