<template>
  <!-- <div class="q-pa-md" style="max-width: 785px"> -->
  <div class="q-py-md" style="max-width: 100%">
    <q-table flat bordered dense title="Clientes" :rows="dataFiltered" :columns="columns" :loading="loadingState"
      loading-label="Cargando información" row-key="name" :filter="filter" binary-state-sort="">

      <!-- Show Documents -->
      <template v-slot:body-cell-documento="props">
        <q-td :props="props">
          <div>
            <q-btn @click="showDocuments" dense round flat size="sm" icon="description">
            </q-btn>
          </div>
        </q-td>
      </template>


      <template v-slot:top-right>

      </template>

      <template v-slot:top>
        <img style="height: 50px; width: 50px" src="../../public/icons/android-chrome-192x192.png" />

        <q-space></q-space>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>


        <!-- Select Slot -->
        <slot name="category-selector"></slot>
      </template>
      <!-- Optional slot -->

      <template v-if="asesorLinks" v-slot:body-cell-asesor="props">
        <q-td :props="props">
          <router-link @click="store.updateAsesorId($event, props.row.asesorId)" :to="{ name: 'asesor' }"
            style="text-decoration: none; color: black">{{
              props.row.asesor }}
          </router-link>
        </q-td>
      </template>

      <template v-if="clienteLinks" v-slot:body-cell-cliente="props">
        <q-td :props="props">
          <router-link @click="store.updateClienteId($event, props.row.clienteId)" :to="{ name: 'cliente' }"
            style="text-decoration: none; color: black">{{
              props.row.cliente }}
          </router-link>
        </q-td>
      </template>

      <template v-slot:body-cell-creditStatus="props">
        <q-td :props="props">
          <div>
            <q-badge :color="statusDict[props.value]" :label="props.value"></q-badge>
          </div>
        </q-td>
      </template>

    </q-table>
  </div>
</template>

<script setup>
import { toRefs, ref, watchEffect, computed } from "vue";
import { useIdsStore } from "src/stores/tableId";
import { storeToRefs } from "pinia";
const store = useIdsStore();


const statusDict = {
  'On Time': 'green',
  'Mora': 'red',

}
const props = defineProps(["data", "columns", "asesorLinks", 'clienteLinks']);
let { data, columns, asesorLinks, clienteLinks } = toRefs(props);
let nombre = ref(null);
let dataFiltered = ref([]);
const filter = ref('')
const loadingState = computed(() => {
  if (data.value[0]) {
    return false;
  }
  return true;
});

const showDocuments = () => {
  alert("Show Documents Functionality");
};

// data filter functions
watchEffect(() => {
  if (nombre.value) {
    dataFiltered.value;
  }
});
watchEffect(() => {
  if (nombre.value) {
    dataFiltered.value = data.value.filter(
      (cliente) => cliente.nombre === nombre.value
    );
  } else {
    dataFiltered.value = data.value;
  }
});
</script>

<style>
::-webkit-scrollbar {
  border-radius: 2px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: white;
}

::-webkit-scrollbar-thumb {
  background-color: seashell;
}
</style>
