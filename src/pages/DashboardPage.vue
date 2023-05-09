<template>
  <q-page>
    <div
      class="col-md-6 col-xs-12 window-width row justify-evenly items-center"
    >
      <q-card>
        <apex-donut :clientes="clientesFiltrado" />
      </q-card>
      <filter-table :data="clientesFiltrado" :columns="columns">
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
          style="min-width: 150px"
        ></q-select>
      </filter-table>
    </div>
    <filter-table :data="tesoreria" :columns="columnsTesoreria"></filter-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref, reactive, watchEffect } from "vue";
import ApexDonut from "src/components/ApexDonut.vue";
import FilterTable from "src/components/FilterTable.vue";
import { api } from "../../src/boot/axios";
const clientes = ref([]);
const clientesFiltrado = ref([]);
const nombres = ref([]);
const nombre = ref(null);
const tesoreria = ref([]);
const tesoreriaFiltrado = ref([]);
onMounted(() => {
  api
    .get("clientes")
    .then((res) => {
      clientes.value = res.data;
      clientes.value.forEach((cliente) => {
        if (nombres.value.indexOf(cliente.nombre) == -1) {
          nombres.value.push(cliente.nombre);
        }
      });
    })
    .catch((err) => console.log(err.message));
  api
    .get("tesoreria")
    .then((res) => {
      tesoreria.value = res.data;
    })
    .catch((err) => console.log(err.message));
});

watchEffect(() => {
  if (nombre.value) {
    clientesFiltrado.value = clientes.value.filter(
      (cliente) => cliente.nombre === nombre.value
    );
  } else {
    clientesFiltrado.value = clientes.value;
  }
});

const columnsTesoreria = reactive([
  {
    name: "categoria",
    required: true,
    label: "Categoría",
    align: "left",
    field: (row) => row.categoria,
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
    required: true,
    label: "Monto",
    align: "left",
    field: (row) => row.monto,
    sortable: true,
  },
  {
    name: "plazo",
    required: true,
    label: "Plazo",
    align: "left",
    field: (row) => row.plazo,
    sortable: true,
  },
  {
    name: "pago",
    required: true,
    label: "Pago",
    align: "left",
    field: (row) => row.pago,
    sortable: true,
  },
]);

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
    // required: true,
    label: "Monto",
    field: (row) => row.monto,
    sortable: true,
  },
  {
    name: "plazo",
    // required: true,
    label: "Plazo",
    align: "left",
    field: (row) => row.plazo,
    sortable: true,
  },
  {
    name: "pago",
    // required: true,
    label: "Pago",
    field: (row) => row.pago,
    sortable: true,
  },
  {
    name: "fechaCorte",
    // required: true,
    label: "Fecha de Corte",
    align: "left",

    field: (row) => row.fechaCorte,
    sortable: true,
  },
  {
    name: "documento",
    label: "Documento",
    align: "left",
    field: (row) => row.documento,
  },
  {
    name: "calificacion",
    required: true,
    label: "Calificacion",
    align: "left",
    field: (row) => row.calificacion,
    sortable: true,
  },
]);
</script>

<style>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
