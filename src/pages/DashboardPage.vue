
<template>
  <q-page padding>
    <div
      class="col-md-6 col-xs-12 window-width row justify-evenly items-center"
    >
      <div class="q-pa-md">
        <q-table
          flat
          bordered
          title="Clientes"
          :rows="clientesFiltrado"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:top>
            <img
              style="height: 50px; width: 50px"
              src="../../public/icons/android-chrome-192x192.png"
            />

            <q-space></q-space>

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
          </template>
        </q-table>
      </div>
      <q-card>
        <apex-donut :clientes="clientesFiltrado" />
      </q-card>
    </div>
    <p>{{ clientes }}</p>
  </q-page>
</template>

<script setup>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import { api } from "src/boot/axios.js";
import apexDonut from "../components/ApexDonut.vue";
let nombres = reactive([]);
let nombre = ref(null);
let clientes = reactive([]);
const x = ref([]);
let clientesFiltrado = reactive([]);

const getInfo = () => {
  api
    .get("clientes")
    .then((res) => {
      // res.json();
      res.data.forEach((element) => {
        clientes.push(element);
      });
      //   clientes = res.data;
      x.value = res.data;
      console.log(clientes);
      prueba();
    })
    .catch((err) => console.log(err.message));
};

// const clientes = reactive([
//   {
//     nombre: "Luis Jimenez",
//     nSolicitud: "12344",
//     monto: "5000000",
//     plazo: "3 meses",
//     pago: "1800000",
//     fechaCorte: "15/02/2023",
//     documento: "",
//     calificacion: "5",
//   },
//   {
//     nombre: "Maria Aleja",
//     nSolicitud: "12345",
//     monto: "20000000",
//     plazo: "1 año",
//     pago: "3000000",
//     fechaCorte: "30/04/2023",
//     documento: "",
//     calificacion: "4",
//   },
//   {
//     nombre: "Luis Jimenez",
//     nSolicitud: "12346",
//     monto: "100000000",
//     plazo: "1 año",
//     pago: "2000000",
//     fechaCorte: "30/03/2023",
//     documento: "",
//     calificacion: "3",
//   },
//   {
//     nombre: "Luz Padilla",
//     nSolicitud: "12347",
//     monto: "10000000",
//     plazo: "6 meses",
//     pago: "900000",
//     fechaCorte: "15/04/2023",
//     documento: "",
//     calificacion: "1",
//   },
//   {
//     nombre: "Alvaro Herrada",
//     nSolicitud: "12348",
//     monto: "8000000",
//     plazo: "10 meses",
//     pago: "800000",
//     fechaCorte: "15/04/2022",
//     documento: "",
//     calificacion: "5",
//   },

//   {
//     nombre: "Alvaro Herrada",
//     nSolicitud: "12349",
//     monto: "1000000",
//     plazo: "10 meses",
//     pago: "100000",
//     fechaCorte: "27/04/2022",
//     documento: "",
//     calificacion: "5",
//   },
//   {
//     nombre: "Alvaro Herrada",
//     nSolicitud: "12350",
//     monto: "900000",
//     plazo: "9 meses",
//     pago: "100000",
//     fechaCorte: "1/05/2022",
//     documento: "",
//     calificacion: "5",
//   },
// ]);

let prueba = () => {
  clientes.forEach((cliente) => {
    if (nombres.indexOf(cliente.nombre) == -1) {
      nombres.push(cliente.nombre);
    }
  });
  //nombres = [...new Set(nombres)];
};
// prueba();

// let nombresSet = computed(() => {
//   let nombres = [];
//   clientes.forEach((cliente) => {
//     nombres.push(cliente.nombre);
//   });
//   nombres = [...new Set(nombres)];
//   return nombres;
// });
watchEffect(async () => {
  if (nombre.value) {
    clientesFiltrado = await clientes.filter(
      (cliente) => cliente.nombre === nombre.value
    );
  } else {
    clientesFiltrado = await clientes;
  }
});
// let clientesFiltrado = computed(() => {
//   if (nombre.value) {
//     return clientes.filter((cliente) => cliente.nombre === nombre.value);
//   } else {
//     return clientes;
//   }
// });
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

watch(nombre, (newValue, oldValue) => {
  console.log(nombre.value);
});

onMounted(() => {
  getInfo();
});
</script>


<style>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
