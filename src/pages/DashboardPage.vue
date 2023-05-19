<template>
  <q-page>
    <div class="col-md-6 col-xs-12 window-width row justify-around items-center" style="padding-top: 20px">
      <q-card>
        <date-time-x :title="nombre" :series="fechaPagoSeries" :width="400" />
      </q-card>

      <q-card class="row justify-evenly">
        <apex-donut :clientes="clientesFiltrado" :title="clientesTitle" width="350" />
        <apex-donut :clientes="tesoreriaFiltrado" :title="tesoreriaTitle" width="350" />
      </q-card>
    </div>

    <div class="row justify-evenly">
      <filter-table :data="clientesFiltrado" :columns="columns" :tableLinks="true">
        <template #category-selector>
          <q-select v-model="nombre" outlined dense options-dense label="vendedor" emit-value map-options
            :options="nombres" option-value="name" options-cover style="min-width: 120px"></q-select>
        </template>
      </filter-table>
      <filter-table :data="tesoreriaFiltrado" :columns="columnsTesoreria">
        <template #category-selector>
          <q-select v-model="tesoreriaKey" outlined dense options-dense label="Cuenta" emit-value map-options
            :options="tesoreriaKeys" option-value="name" options-cover style="min-width: 120px"></q-select>
        </template>
      </filter-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from "vue";
import { useQuasar } from "quasar";
import ApexDonut from "src/components/Charts/ApexDonut.vue";
import DateTimeX from "src/components/Charts/DateTimeX.vue";
import FilterTable from "src/components/FilterTable.vue";
import { api, apiCliente } from "../../src/boot/axios";


// utils
import { scoreCalculator, progressCalculator, formattedTotal, datePayDictCreate, datePaySeriesCreate } from "src/scripts/utils"


let $q = useQuasar();

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

const tesoreria = ref([]);
const tesoreriaFiltrado = ref([]);
const tesoreriaKeys = ref([]);
const tesoreriaKey = ref(null);
const tesoreriaTitle = computed(() => {
  if (tesoreriaKey.value) {
    return tesoreriaKey.value;
  }
  return "Solicitudes";
});



// Function to create
const createFilterData = (data, target, attr) => {
  data.value.forEach((row) => {
    if (target.value.indexOf(row[`${attr}`]) == -1) {
      target.value.push(row[`${attr}`]);
    }
  });
};

const fechaPagoSeries = computed(() => {

  let [fechaDict, pagosDict, moraDict] = datePayDictCreate(clientesFiltrado.value)
  let proyeccion = datePaySeriesCreate(fechaDict)
  let pagos = datePaySeriesCreate(pagosDict)
  let mora = datePaySeriesCreate(moraDict)

  return [{ name: "Proyección", data: proyeccion }, { name: "Pagos", data: pagos, }, { name: "Mora", data: mora }];
});

// get requests
onMounted(() => {
  $q.sessionStorage.set(
    "finansofttoken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgzODA5NjgzLCJleHAiOjE2ODY0MDE2ODN9.dPVkxu166TZS25CWYPGGUQ6V4jSY3rBrxa9J82BIIQc"
  );

  api
    .get("clientes")
    .then((res) => {
      clientes.value = res.data;
      createFilterData(clientes, nombres, "nombre");
    })
    .catch((err) => console.log(err.message));
  api
    .get("tesoreria")
    .then((res) => {
      tesoreria.value = res.data;
      createFilterData(tesoreria, tesoreriaKeys, "categoria");
    })
    .catch((err) => console.log(err.message));
  apiCliente
    .get("v1/customers?filters[identification][$eq]=1010063326&populate=*")
    .then((res) => {
      console.log("hola");
      console.log(res);
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
    label: "Plazo (m)",
    align: "right",
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
    format: (val, row) => row.nombre,
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
    name: "fechaSolicitud",
    label: "Fecha solicitud",
    align: "right",
    field: (row) => row.fechaSolicitud,
    sortable: true
  },
  {
    name: "progreso",
    label: "Progreso",
    align: "right",
    field: (row) => row.planPago,
    format: (val, row) => {
      let progress = progressCalculator(val)
      return `${progress}%`
    }
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
  max-width: 200px;
}
</style>
