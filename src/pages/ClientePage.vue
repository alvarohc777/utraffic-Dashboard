<template >
  <!-- #2fd4ad -->
  <div v-if="clientesOriginal.length !== clientes.length" class="row justify-between items-center q-pa-md page"
    style="padding-top: 20px; padding-bottom: 5px;  align-items: stretch;">

    <q-card class="my-card flex" style="flex-direction: column; justify-content: space-between;">
      <q-card-section>
        <div class="text-h5 text-purple-10">{{ nombre }}</div>
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
      <q-card-section>
        <p style="margin: 0px" class="text-purple-10">
          <strong> Total: </strong>
        </p>
        <p class="text-subtitle2">{{ formattedTotal.format(total) }}</p>
      </q-card-section>
      <q-card-section class="row justify-center">

        <semi-circular :progress="calificacion * 100 / 5" :title="'Calificación'" :score="clientes[0].calificacion"
          :key="clientes[0].calificacion" />

      </q-card-section>
    </q-card>




    <div class="row justify-evenly" style="flex-grow: 1;">
      <q-card class="my-card row justify-between column" style="max-width: 350px;">
        <q-card>
          <date-time-x :series="fechaPagoSeries" width="100%" :key="fechaPagoSeries" />
        </q-card>
        <apex-donut :clientes="clientes" width="100%" :key="clientes" />
      </q-card>
      <q-card class="my-card row justify-between column" v-for=" cliente  in  clientes " :key="cliente">
        <div>

          <p class="text-h6 text-purple-10 text-center" style="margin-bottom: 0;"> Crédito</p>
          <p class="text-subtitle2  text-center"> {{ cliente.nSolicitud }}</p>
        </div>
        <!-- <donut-individual :series="createSeries(cliente.monto, total)" :title="cliente.nSolicitud" /> -->
        <semi-circular :progress="progressCalculator(cliente.planPago)" title="Progreso"
          :score="scoreCalculator(cliente.planPago)" />

        <!-- <h5>{{ [cliente.monto, total] }}</h5> -->
        <div>
          <q-card-section>
            <div class="flex flex-center column">
              <div class="row " style="width: 100%">
                <div class="fit row wrap justify-start items-start content-start">
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Crédito: </strong>
                    </p>
                    <p class="text-subtitle2">{{ cliente.nSolicitud }}</p>
                  </div>
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Fecha Solicitud: </strong>
                    </p>
                    <p class="text-subtitle2">{{ cliente.fechaSolicitud }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-center column">
              <div class="row" style="width: 100%">
                <div class="fit row wrap justify-start items-start content-start">
                  <div class="col">
                    <p style="margin: 0px" class="text-purple-10">
                      <strong> Monto: </strong>
                    </p>
                    <p class="text-subtitle2">{{ formattedTotal.format(cliente.monto) }}</p>
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

  max-width: 250px;
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
import { ref, reactive, watchEffect, onMounted, computed } from "vue";

// components
import FilterTable from "src/components/FilterTable.vue";
import SemiCircular from "src/components/Charts/SemiCircular.vue";
import DonutIndividual from "src/components/Charts/DonutIndividual.vue";
import DateTimeX from "src/components/Charts/DateTimeX.vue";
import ApexDonut from "src/components/Charts/ApexDonut.vue";

// utils
import { progressCalculator, scoreCalculator, formattedTotal, datePayDictCreate, datePaySeriesCreate } from "src/scripts/utils"

// Constants and Variables
const router = useRouter();
const route = useRoute();
const nombre = ref(route.query.nombre);
const clientes = ref([]);
const clientesOriginal = ref([]);
const clientesFiltrado = ref([]);
const nombres = ref([]);



const calificacion = computed(() => {
  if (clientes.value[0]) {
    return clientes.value[0].calificacion;
  }
  return null;
});

// Llena un array target sin duplicados partiendo de
// los atributos de un objeto data, el atributo es attr
const createFilterData = (data, target, attr) => {
  data.value.forEach((row) => {
    if (target.value.indexOf(row[`${attr}`]) == -1) {
      target.value.push(row[`${attr}`]);
    }
  });
};



// Computed properties

const clientesTitle = computed(() => {
  if (nombre.value) {
    return nombre.value;
  }
  return "Solicitudes";
});

const fechaPagoSeries = computed(() => {

  let [fechaDict, pagosDict, moraDict] = datePayDictCreate(clientesFiltrado.value)
  let proyeccion = datePaySeriesCreate(fechaDict)
  let pagos = datePaySeriesCreate(pagosDict)
  let mora = datePaySeriesCreate(moraDict)

  // let lastDate = mora[mora.length -1 ]
  // lastDate.setMonth(new Date(lastDate))

  return [{ name: "Proyección", data: proyeccion }, { name: "Pagos", data: pagos, }, { name: "Mora", data: mora }];
})

const total = computed(() => {
  let total = 0
  clientes.value.forEach((cliente) => {
    total += parseFloat(cliente.monto)
  })
  return total;
})




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
    name: "fechaSolicitud",
    label: "Fecha solicitud",
    align: "right",
    field: (row) => row.fechaSolicitud,
    // format: (val, row) => {
    //   let fecha = row.fechaSolicitud.split("/");
    //   return `${fecha[0]}/${fecha[1]}/${fecha[2].slice(2, 4)}`
    // },
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
    name: "cumplimiento",
    label: "Cumplimiento",
    align: "left",
    field: (row) => {
      let calificacion = scoreCalculator(row.planPago)
      return `${"\u2B50".repeat(calificacion)}`
    }

  },
]);
</script>

