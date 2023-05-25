<template>
  <p>{{ advisor[0] }}</p>
</template>
<style></style>


<script setup>
import { apiCliente } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { jsonTransform } from 'src/scripts/utils';


// Esto debe settearse al iniciar sesión
let $q = useQuasar();
$q.sessionStorage.set(
  "finansofttoken",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg0ODUzNDkxLCJleHAiOjE2ODc0NDU0OTF9.1bxW_sbUbzNqIwPMXaDRkeIu__GIrk3LBZUENilkI5A"
);

const credits = ref([]);
const clientes = ref([]);
const advisor = ref([]);

// Credits Fetch
apiCliente
  .get('/credits?populate=customer&populate=businessadvisor')
  .then((res) => {
    console.log("Test creditS request: ", res.data.data)
    credits.value = jsonTransform(res.data.data)
  })
  .catch((err) => console.log(err.message));

// Customers Fetch
apiCliente
  .get('/customers?populate[credits][populate]=businessadvisor')
  .then((res) => {
    console.log("Test CustomerS request: ", res.data.data)
    clientes.value = res.data.data
    // Crear transformation function CLIENTES
  })
  .catch((err) => console.log(err.message));

// Customer Fetch
apiCliente
  .get('/customers/2?populate[credits][populate]=businessadvisor')
  .then((res) => {
    console.log("Test Customer request: ", res.data.data)
    clientes.value = res.data.data
    // Crear transformation function CLIENTES
  })
  .catch((err) => console.log(err.message));

// Business AdvisorS Fetch
apiCliente
  .get("/businessadvisors?populate[credits][populate]=customer")
  .then((res) => {
    console.log("Test businessadvisorS request:", res.data.data)
    advisor.value = res.data.data
    // Crear transformation funtion ADVISOR
  })
  .catch((err) => console.log(err.message));

// Business Advisor Fetch
apiCliente
  .get("/businessadvisors/1?populate[credits][populate]=customer")
  .then((res) => {
    console.log("Test businessadvisor request:", res.data.data)

    // Crear transformation funtion ADVISOR
  })
  .catch((err) => console.log(err.message));

</script>
