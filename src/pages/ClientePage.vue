<template>
  <div
    class="row justify-evenly items-center"
    style="padding-top: 20px; padding-bottom: 20px"
  >
    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle2 text-center">Title</div>
      </q-img>
    </q-card>
    <q-card class="row justify-evenly"></q-card>
    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle2 text-center">Title</div>
      </q-img>
    </q-card>
    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle2 text-center">Title</div>
      </q-img>
    </q-card>
    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle2 text-center">Title</div>
      </q-img>
    </q-card>
  </div>
  <div
    class="row justify-evenly items-center"
    style="padding-top: 20px; padding-bottom: 20px"
  >
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
    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle2 text-center">Title</div>
      </q-img>
    </q-card>
  </div>
</template>

<script setup>
import FilterTable from "src/components/FilterTable.vue";
import { ref, computed, onMounted, watchEffect, reactive } from "vue";
import { api } from "src/boot/axios";
const clientes = ref([]);
const clientesFiltrado = ref([]);
const nombres = ref([]);
const nombre = ref(null);
const clientesTitle = computed(() => {
  if (nombre.value) {
    return nombre.value;
  }
  return "Solicitudes";
});
const formattedTotal = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const onClick = () => {
  alert("hola");
};

const createFilterData = (data, target, attr) => {
  // target.value.push("-");
  data.value.forEach((row) => {
    if (target.value.indexOf(row[`${attr}`]) == -1) {
      target.value.push(row[`${attr}`]);
    }
  });
};

onMounted(() => {
  api
    .get("clientes")
    .then((res) => {
      clientes.value = res.data;
      createFilterData(clientes, nombres, "nombre");
    })
    .catch((err) => console.log(err.message));
  api;
});

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
}
</style>
