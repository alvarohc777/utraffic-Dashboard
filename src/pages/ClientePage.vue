<template >
  <!-- #2fd4ad -->
  <div v-if="clientesOriginal.length !== clientes.length" class="row justify-between items-center q-pa-md page"
    style="padding-top: 20px; padding-bottom: 5px;  align-items: stretch;">

    <q-card class="my-card">
      <q-card-section>
        <div class="text-h5">{{ nombre }}</div>
      </q-card-section>

      <q-card-section class="row justify-between">
        <div>
          <p style="margin: 0px" class="text-purple-10">
            <strong> Créditos: </strong>
          </p>
          <div v-for="cliente in clientes" :key="cliente">
            {{ cliente.nSolicitud }}
          </div>
        </div>
        <img src="../../src/assets/profileIcon.png" style="width: 70px; height: 70px" />

      </q-card-section>
      <q-card-section class="row justify-center">
        <semi-circular :calificacion="calificacion" />
      </q-card-section>



    </q-card>




    <div class="row justify-evenly" style="flex-grow: 1;">
      <q-card class="my-card" v-for="cliente in clientes" :key="cliente">
        <img src="https://cdn.quasar.dev/img/mountains.jpg">
        <div>
          <q-card-section>


            <div class="flex flex-center column">
              <div class="row " style="width: 100%; padding: 10px 5px 0 5px;">
                <div class="fit row wrap justify-start items-start content-start">
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Crédito: </strong>
                    </p>
                    <p class="text-subtitle2">{{ cliente.nSolicitud }}</p>
                  </div>
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Fecha Corte: </strong>
                    </p>
                    <p class="text-subtitle2">{{ cliente.fechaCorte }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-center column">
              <div class="row" style="width: 100%; padding: 10px 5px 0 5px;">
                <div class="fit row wrap justify-start items-start content-start">
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Monto: </strong>
                    </p>
                    <p class="text-subtitle2">{{ cliente.monto }}</p>
                  </div>
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Plazo: </strong>
                    </p>
                    <p class="text-subtitle2">{{ cliente.plazo }}</p>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </div>



      </q-card>
    </div>

  </div>





  <div class="row justify-start items-center page" style="padding-top: 5px; padding-bottom: 20px" v-if="clientes">
    <filter-table :data="clientes" :columns="columns" :key="nombre" :tableLinks="true">
      <template #category-selector>
        <q-select v-model="nombre" outlined dense options-dense label="vendedor" emit-value map-options :options="nombres"
          option-value="name" options-cover style="min-width: 120px"></q-select>
      </template>
    </filter-table>
  </div>
</template>

<style>
.my-card {
  width: 100%;

  max-width: 220px;
  padding: 2px;
  margin: 5px;
}

.page {
  margin-left: 70px;

  margin-right: 70px;
}
</style>

<script setup>
// ---> Imports

// packages
import { useRouter, useRoute } from "vue-router";
import { api } from "src/boot/axios";
import { ref, reactive, watchEffect, onMounted, watch, computed } from "vue";

// components
import FilterTable from "src/components/FilterTable.vue";
import SemiCircular from "src/components/Charts/SemiCircular.vue"

// Constants and Variables
const router = useRouter();
const route = useRoute();
const nombre = ref(route.query.nombre);
const clientes = ref([]);
const clientesOriginal = ref([]);
const clientesFiltrado = ref([]);
const newName = ref(null);
const nombres = ref([]);

const calificacion = computed(() => {
  if (clientes.value[0]) {
    return clientes.value[0].calificacion;
  }
  return null;
});

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

// Llena el array 'nombres' con todos los nombres disponibles
// en la base de datos (solo lo hace una vez cuando se hace el
// mount).
onMounted(() => {
  api
    .get("clientes")
    .then((res) => {
      clientesOriginal.value = res.data
      let nameHolder = {};
      nameHolder.value = res.data;
      createFilterData(nameHolder, nombres, "nombre");
    })
    .catch((err) => console.log(err.message));
});

// Watchers

// Actualiza la variable clientes cuando cambia el nombre
// escogido o cuando se actualiza el URL query
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

watchEffect(() => {

  console.log(route.query.nombre)
  nombre.value = route.query.nombre
})

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

