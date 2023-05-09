<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Clientes"
      :rows="dataFiltered"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top>
        <img
          style="height: 50px; width: 50px"
          src="../../public/icons/android-chrome-192x192.png"
        />

        <q-space></q-space>
        <slot></slot>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { toRefs, ref, watchEffect, onMounted, reactive, computed } from "vue";

const props = defineProps(["data", "columns"]);
let { data, columns } = toRefs(props);
let nombre = ref(null);
let dataTemp = ref(data);
let dataFiltered = ref([]);

const nombres = computed(() => {
  let _ = [];
  dataTemp.value.forEach((cliente) => {
    if (_.indexOf(cliente.nombre) == -1) {
      _.push(cliente.nombre);
    }
  });

  return _;
});
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
let nombreChange = () => {
  console.log("click");
};
</script>

<style>
</style>
