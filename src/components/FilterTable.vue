<template>
  <div class="q-pa-md" style="max-width: 785px">
    <q-table
      flat
      bordered
      dense
      title="Clientes"
      :rows="dataFiltered"
      :columns="columns"
      :loading="loadingState"
      loading-label="Cargando información"
      row-key="name"
    >
      <template v-slot:body-cell-documento="props">
        <q-td :props="props">
          <div>
            <q-btn
              @click="showDocuments"
              dense
              round
              flat
              size="sm"
              icon="description"
            >
            </q-btn>
          </div>
        </q-td>
      </template>
      <template v-slot:top>
        <img
          style="height: 50px; width: 50px"
          src="../../public/icons/android-chrome-192x192.png"
        />

        <q-space></q-space>

        <slot name="category-selector"></slot>
      </template>
      <template v-if="tableLinks === true" v-slot:body-cell-nombre="props">
        <q-td :props="props">
          <router-link
            :to="{ name: 'cliente', query: { nombre: props.value } }"
            style="text-decoration: none; color: black"
          >
            {{ props.value }}
          </router-link>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { toRefs, ref, watchEffect, computed } from "vue";

const props = defineProps(["data", "columns", "tableLinks"]);
let { data, columns, tableLinks } = toRefs(props);
let nombre = ref(null);
let dataFiltered = ref([]);

const loadingState = computed(() => {
  if (data.value[0]) {
    console.log("value");

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
