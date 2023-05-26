<template>
  <q-page-container>

    <q-page>
      <q-card class="row justify-evenly">
        <date-time-x :title="advisorTitle" :series="timeSeries" width="140%" />
        <apex-donut :data="creditsFiltered" :title="advisorTitle" width="100%" />
        <proyection-bar :series="timeSeries"></proyection-bar>
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
  <p>{{ timeSeries }}</p>
</template>
<style></style>


<script setup>

// Imports
import { onMounted, ref, reactive, watchEffect, computed } from 'vue';
import { apiCliente } from 'src/boot/axios';
import { useQuasar } from 'quasar';

// // Components
import FilterTable from 'src/components/FilterTable.vue';
import ApexDonut from 'src/components/Charts/ApexDonut.vue';
import DateTimeX from 'src/components/Charts/DateTimeX.vue';
import proyectionBar from 'src/components/Charts/proyectionBar.vue'

// // Scripts
import { progressCalculator, mesesPagos, currentFee, creditStatus, datePayDictCreate, datePaySeriesCreate } from 'src/scripts/paymentInfo'
import { formattedTotal, createFilterData, selectFilter, } from 'src/scripts/utils'
import { jsonTransform } from 'src/scripts/jsonTransforms'

// Esto debe settearse al iniciar sesión
let $q = useQuasar();
$q.sessionStorage.set(
  "finansofttoken",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg0ODUzNDkxLCJleHAiOjE2ODc0NDU0OTF9.1bxW_sbUbzNqIwPMXaDRkeIu__GIrk3LBZUENilkI5A"
);

const credits = ref([]);
const creditsFiltered = ref([])
const advisors = ref([]);
const advisor = ref(null);
const advisorTitle = computed(() => {
  if (advisor.value) {
    return advisor.value
  }
  return 'Solicitudes'
})


const timeSeries = computed(() => {
  console.log(creditsFiltered.value)
  let [fechaDict, pagosDict, moraDict] = datePayDictCreate(creditsFiltered.value)
  let proyeccion = datePaySeriesCreate(fechaDict)
  let pagos = datePaySeriesCreate(pagosDict)
  let mora = datePaySeriesCreate(moraDict)

  return [{ name: "Pagos", data: pagos, type: 'column' }, { name: "Mora", data: mora, type: 'column' }, { name: "Proyección", data: proyeccion, type: 'line' },];

})


watchEffect(() => {
  selectFilter(credits, creditsFiltered, advisor, advisors, 'asesor')
});


onMounted(() => {
  apiCliente
    .get('/credits?populate=customer&populate=businessadvisor')
    .then((res) => {
      console.log("Test creditS request: ", res.data.data)
      // credits.value = jsonClientes(res.data.data)
      // console.log("Clientes Transform: ", credits.value)
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
      ['paymentFee', 'payment_fee']
      ]

      credits.value = jsonTransform(res.data.data, keysToFind)
      createFilterData(credits, advisors, 'asesor')
      // advisors.value = credits.value
      console.log("new Json recursive: ", credits)
    })
    .catch((err) => console.log(err.message));
})
// Credits Fetch












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
      return currentFee(val)
    }
  },
  {
    name: "CreditStatus",
    label: "Estado",
    align: "right",
    sortable: true,
    field: (row) => creditStatus(row.paymentFee),

  },



]);


</script>
