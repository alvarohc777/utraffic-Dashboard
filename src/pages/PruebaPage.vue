<template>
  <p>
    { Hola }
  </p>

  <div style="max-width: 100%; justify-content: center;" class="row ">
    <filter-table :data="creditsFiltered" :columns="columns">
      <template #category-selector>
        <q-select v-model="advisor" outlined dense options-dense label="Cuenta" emit-value map-options :options="advisors"
          option-value="name" options-cover style="min-width: 120px"></q-select>
      </template>
    </filter-table>
  </div>
</template>
<style></style>


<script setup>
import { apiCliente } from 'src/boot/axios';
import { format, useQuasar } from 'quasar';
import { onMounted, ref, reactive, watchEffect } from 'vue';
import FilterTable from 'src/components/FilterTable.vue';
import { formattedTotal, createFilterData } from 'src/scripts/utils'
import { progressCalculator, mesesPagos, currentFee } from 'src/scripts/paymentInfo'
import { jsonTransform } from 'src/scripts/jsonTransforms'

// Esto debe settearse al iniciar sesión
let $q = useQuasar();
$q.sessionStorage.set(
  "finansofttoken",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg0ODUzNDkxLCJleHAiOjE2ODc0NDU0OTF9.1bxW_sbUbzNqIwPMXaDRkeIu__GIrk3LBZUENilkI5A"
);

const credits = ref([]);
const creditsFiltered = ref([])
const clientes = ref([]);
const advisors = ref([]);
const advisor = ref(null);
const creditsFiltrado = ref([])

const funct = (data, dataFiltered, field, fields, attr) => {
  if (field.value && field.value !== '-') {
    dataFiltered.value = data.value.filter(
      (row) => row[attr] === field.value
    )
    if (fields.value.indexOf('-') == -1) {
      fields.value.unshift('-');
    }
    return
  }
  if (field.value == '-') {
    fields.value.shift();
    field.value = null;
  }
  dataFiltered.value = data.value
}


watchEffect(() => {
  funct(credits, creditsFiltered, advisor, advisors, 'asesor')
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
      ['monto', 'amount'],
      ['plazo', 'term'],
      ['fechaSolicitud', 'applicationdate'],
      ['calificacion', 'score'],
      ['asesor', 'businessadvisor', 'full_name'],
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

// Customers Fetch
apiCliente
  .get('/customers?populate[credits][populate]=businessadvisor')
  .then((res) => {
    // console.log("Test CustomerS request: ", res.data.data)
    // clientes.value = res.data.data
    // let keysToFind = ['full_name', 'credits']
    // let newJson = jsonTransform(res.data.data, keysToFind)
    // console.log("new Json recursive Customers", newJson)
    // Crear transformation function CLIENTES
  })
  .catch((err) => console.log(err.message));

// Customer Fetch
apiCliente
  .get('/customers/2?populate[credits][populate]=businessadvisor')
  .then((res) => {
    // console.log("Test Customer request: ", res.data.data)
    // clientes.value = res.data.data

    // Crear transformation function CLIENTES
  })
  .catch((err) => console.log(err.message));

// Business AdvisorS Fetch
apiCliente
  .get("/businessadvisors?populate[credits][populate]=customer")
  .then((res) => {
    // console.log("Test businessadvisorS request:", res.data.data)
    // advisor.value = res.data.data
    // Crear transformation funtion ADVISOR

    // let keysToFind = [
    //   ['asesorNombre', 'businessadvisor', 'full_name'],
    //   ['credits', 'credits']
    // ]
    // let newJson = jsonTransform(res.data.data, keysToFind)
  })
  .catch((err) => console.log(err.message));

// Business Advisor Fetch
apiCliente
  .get("/businessadvisors/1?populate[credits][populate]=customer")
  .then((res) => {
    // console.log("Test businessadvisor request:", res.data.data)

    // Crear transformation funtion ADVISOR
  })
  .catch((err) => console.log(err.message));





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
    field: (row) => row.paymentHistorical,
    sortable: true,
    format: (val, row) => {
      let pagos = mesesPagos(val)
      return `${pagos}`
    }
  },
  {
    name: "progreso",
    label: "Progreso",
    align: "right",
    sortable: true,
    field: (row) => row.paymentFee,
    format: (val, row) => {
      let progress = progressCalculator(val)
      return `${progress}%`
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



]);


</script>
