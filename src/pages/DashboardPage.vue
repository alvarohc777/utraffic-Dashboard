<template>
  <q-page>
    <div
      class="col-md-6 col-xs-12 window-width row justify-around items-center"
      style="padding-top: 20px"
    >
      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="text-h5 absolute-bottom text-right">Title</div>
        </q-img>
      </q-card>
      <q-card class="row justify-evenly">
        <apex-donut :clientes="clientesFiltrado" :title="clientesTitle" />
        <apex-donut :clientes="tesoreriaFiltrado" :title="tesoreriaTitle" />
      </q-card>
    </div>

    <div class="row justify-evenly">
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
          style="min-width: 120px"
        ></q-select>
      </filter-table>
      <filter-table :data="tesoreriaFiltrado" :columns="columnsTesoreria">
        <q-select
          v-model="tesoreriaKey"
          outlined
          dense
          options-dense
          label="Cuenta"
          emit-value
          map-options
          :options="tesoreriaKeys"
          option-value="name"
          options-cover
          style="min-width: 120px"
        ></q-select>
      </filter-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from "vue";
import { api } from "../../src/boot/axios";
import ApexDonut from "src/components/ApexDonut.vue";
import FilterTable from "src/components/FilterTable.vue";

const clientes = ref([]);
const clientesFiltrado = ref([]);
const nombres = ref([]);
const nombre = ref(null);

const tesoreria = ref([]);
const tesoreriaFiltrado = ref([]);
const tesoreriaKeys = ref([]);
const tesoreriaKey = ref(null);

const formattedTotal = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
// Function to create
const createFilterData = (data, target, attr) => {
  // target.value.push("-");
  data.value.forEach((row) => {
    if (target.value.indexOf(row[`${attr}`]) == -1) {
      target.value.push(row[`${attr}`]);
    }
  });
};

// get requests
onMounted(() => {
  api
    .get("clientes")
    .then((res) => {
      clientes.value = res.data;
      // nombres.value.push("-");
      createFilterData(clientes, nombres, "nombre");
    })
    .catch((err) => console.log(err.message));
  api
    .get("tesoreria")
    .then((res) => {
      tesoreria.value = res.data;
      // tesoreriaKeys.value.push("-");
      createFilterData(tesoreria, tesoreriaKeys, "categoria");
    })
    .catch((err) => console.log(err.message));
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

watchEffect(() => {
  if (tesoreriaKey.value && tesoreriaKey.value !== "-") {
    tesoreriaFiltrado.value = tesoreria.value.filter(
      (row) => row.categoria === tesoreriaKey.value
    );
    if (tesoreriaKeys.value.indexOf("-") == -1) {
      tesoreriaKeys.value.unshift("-");
    }
    return;
  }
  if (tesoreriaKey.value === "-") {
    tesoreriaKeys.value.shift();
    tesoreriaKey.value = null;
  }
  tesoreriaFiltrado.value = tesoreria.value;
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
    align: "right",
    field: (row) => row.monto,
    format: (val, row) => `${formattedTotal.format(row.monto)}`,
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
    align: "right",
    field: (row) => row.pago,
    sortable: true,
    format: (val, row) => `${formattedTotal.format(row.pago)}`,
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
    format: (val, row) => `${formattedTotal.format(row.monto)}`,
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

    format: (val, row) => `${formattedTotal.format(row.pago)}`,
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
  /* width: 100%; */
  max-width: 200px;
}
</style>
