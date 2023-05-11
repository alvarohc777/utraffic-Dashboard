<template>
  <div>
    <div class="chart-wrap">
      <apexchart
        type="donut"
        width="350"
        :options="optionsCalc"
        :series="seriesCalc"
        :key="seriesCalc"
      ></apexchart>
    </div>
  </div>
</template>

<style>
.chart-wrap {
  height: 260px;
}
</style>

<script setup>
import { computed, toRefs, ref } from "vue";
import Vue from "vue";

// Convertir props a variable
const props = defineProps({ clientes: Object, title: String });
let { clientes, title } = toRefs(props);

let USDollar = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "COP",
});

const seriesCalc = computed(() => {
  let series = [];
  clientes.value.forEach((cliente) => {
    series.push(parseFloat(cliente.monto));
  });

  return series;
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

