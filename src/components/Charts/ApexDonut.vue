<template>
  <div class="chart-wrap relative-position">
    <div>
      <apexchart
        type="donut"
        width="350"
        :options="optionsCalc"
        :series="seriesCalc"
        :key="seriesCalc"
      ></apexchart>
    </div>
    <div style="position: relative; left: 160px; bottom: 12px">
      <p style="font-weight: bold; font-family: arial">
        Total: {{ USDollar.format(parseInt(total)) }}
      </p>
    </div>
    <q-inner-loading
      :showing="visible"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    >
      <q-spinner color="primary" size="3em"></q-spinner>
      <!-- <q-spinner-gears size="50px" color="primary"></q-spinner-gears> -->
    </q-inner-loading>
  </div>
</template>

<style>
.chart-wrap {
  height: 260px;
}
</style>

<script setup>
import { computed, toRefs, ref, watchEffect, onMounted } from "vue";
import Vue from "vue";

// Convertir props a variable
const props = defineProps({ clientes: Object, title: String });
let { clientes, title } = toRefs(props);
const visible = ref(true);

watchEffect(() => {
  if (clientes.value[0]) {
    visible.value = false;
  }
  if (!clientes.value[0]) {
    visible.value = true;
  }
});
let USDollar = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "COP",
});

const seriesCalc = computed(() => {
  let series = [];
  let total = 0;

  clientes.value.forEach((cliente) => {
    series.push(parseFloat(cliente.monto));
  });

  return series;
});
const total = computed(() => {
  let total = 0;

  clientes.value.forEach((cliente) => {
    total += parseFloat(cliente.monto);
  });

  return total;
});

const optionsCalc = computed(() => {
  let options = {
    yaxis: {
      labels: {
        formatter: function (value) {
          return `${USDollar.format(value)}`;
        },
      },
    },

    title: {
      text: `${title.value}`,
    },

    labels: [],
    chart: {
      width: 450,
      type: "donut",
    },
    dataLabels: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
  };

  let labels = [];
  clientes.value.forEach((cliente) => {
    labels.push(`${cliente.nSolicitud}`);
  });
  options.labels = labels;
  return options;
});
</script>

