<template>
  <p>
    hola
  </p>
</template>
<style></style>


<script setup>
import { apiCliente } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { onMounted, ref, reactive } from 'vue';
import FilterTable from 'src/components/FilterTable.vue';

import { jsonTransform } from 'src/scripts/jsonTransforms'

// Esto debe settearse al iniciar sesión
let $q = useQuasar();
$q.sessionStorage.set(
  "finansofttoken",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg0ODUzNDkxLCJleHAiOjE2ODc0NDU0OTF9.1bxW_sbUbzNqIwPMXaDRkeIu__GIrk3LBZUENilkI5A"
);

const credits = ref([]);
const clientes = ref([]);
const advisor = ref([]);

onMounted(() => {
  apiCliente
    .get('/credits?populate=customer&populate=businessadvisor')
    .then((res) => {
      console.log("Test creditS request: ", res.data.data)
      // credits.value = jsonClientes(res.data.data)
      // console.log("Clientes Transform: ", credits.value)
      let keysToFind = [['valor', 'amount'], ['cliente_nombre', 'customer', 'full_name']]

      let newJson = jsonTransform(res.data.data, keysToFind)
      console.log("new Json recursive: ", newJson)
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
    advisor.value = res.data.data
    // Crear transformation funtion ADVISOR
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


// Json Transformation Functions


const columns = reactive([
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    format: (val, row) => row.nombre,
    sortable: true,
  },
  {
    name: "nSolicitud",
    required: true,
    label: "N° Solicitud",
    align: "right",
    field: (row) => row.id,
    sortable: true,
  },

]);


</script>
