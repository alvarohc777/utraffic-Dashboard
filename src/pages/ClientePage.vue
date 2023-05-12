<template>
  <div
    class="row justify-evenly items-center"
    style="padding-top: 20px; padding-bottom: 20px"
  ></div>

  <h1>{{ nombre }}</h1>
  <input type="text" v-model="newName" />
  <button @click="updateNameQuery">Update Name</button>
  <h5>{{ newName }}</h5>

  <div
    class="row justify-evenly items-center"
    style="padding-top: 20px; padding-bottom: 20px"
    v-if="clientes"
  >
    <filter-table :data="clientes" :columns="columns" :key="nombre">
      <q-select
        v-model="nombre"
        outlined
        dense
        options-dense
        label="vendedor"
        emit-value
        map-options
        :options="nombres"
        option-value="name"
        options-cover
        style="min-width: 120px"
      ></q-select>
    </filter-table>
  </div>
</template>

<script setup>
// ---> Imports

// packages
import { useRouter, useRoute } from "vue-router";
import { api } from "src/boot/axios";
import { ref, reactive, watchEffect, onMounted } from "vue";

// components
import FilterTable from "src/components/FilterTable.vue";

// Constants and Variables
const router = useRouter();
const route = useRoute();
const nombre = ref(route.query.nombre);
const clientes = ref([]);
const clientesFiltrado = ref([]);
const newName = ref(null);
const nombres = ref([]);

// Functions
const updateNameQuery = () => {
  nombre.value = newName.value;
  router.replace({
    path: route.path,
    query: { nombre: newName.value },
  });
  // router.replace({ ...router.currentRoute, query: { nombre: newName.value } });
  // router.push({ query: { ...route.query, names: newName } });
};

const createFilterData = (data, target, attr) => {
  // target.value.push("-");
  data.value.forEach((row) => {
    if (target.value.indexOf(row[`${attr}`]) == -1) {
      target.value.push(row[`${attr}`]);
    }
  });
};

const formattedTotal = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

onMounted(() => {
  api
    .get("clientes")
    .then((res) => {
      let nameHolder = {};
      nameHolder.value = res.data;
      createFilterData(nameHolder, nombres, "nombre");
    })
    .catch((err) => console.log(err.message));
});

// Watchers
watchEffect(() => {
  api
    .get("clientes", {
      params: {
        nombre: nombre.value,
      },
    })
    .then((res) => {
      clientes.value = res.data;
      router.replace({
        path: route.path,
        query: { nombre: nombre.value },
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// watch changes on dropdown menu selection
watchEffect(() => {
  if (nombre.value && nombre.value !== "-") {
    clientesFiltrado.value = clientes.value.filter(
      (cliente) => cliente.nombre === nombre.value
    );
    if (nombres.value.indexOf("-") == -1) {
      nombres.value.unshift("-");
    }
    return;
  }
  if (nombre.value === "-") {
    nombres.value.shift();
    nombre.value = null;
  }
  clientesFiltrado.value = clientes.value;
});

const columns = reactive([
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    sortable: true,
  },
  {
    name: "nSolicitud",
    required: true,
    label: "N° Solicitud",
    align: "left",
    field: (row) => row.nSolicitud,
    sortable: true,
  },
  {
    name: "monto",
    label: "Monto",
    field: (row) => row.monto,
    format: (val, row) => `${formattedTotal.format(row.monto)}`,
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
    name: "pago",
    label: "Pago",
    field: (row) => row.pago,
    format: (val, row) => `${formattedTotal.format(row.pago)}`,
    sortable: true,
  },
  {
    name: "fechaCorte",
    label: "Fecha Corte",
    align: "left",
    field: (row) => row.fechaCorte,
    sortable: true,
    format: (val, row) => {
      let fecha = row.fechaCorte.split("/");
      return `${fecha[0]}/${fecha[1]}/${fecha[2].slice(2, 4)}`;
    },
  },
  {
    name: "documento",
    label: "Doc",
    align: "left",
    field: (row) => row.documento,
    format: () => "",
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
]);
</script>








<style>
.my-card {
  width: 100%;
  max-width: 250px;
  padding: 2px;
  margin: 10px;
  background-color: purple;
}
</style>
