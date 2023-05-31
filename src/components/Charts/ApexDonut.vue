<template>
  <div class="chart-wrap relative-position">
    <div class="chart-container">
      <apexchart type="donut" :width="width" :options="optionsCalc" :series="seriesCalc" :key="seriesCalc"></apexchart>
    </div>

    <q-inner-loading :showing="visible" label="Please wait..." label-class="text-teal" label-style="font-size: 1.1em">
      <q-spinner color="primary" size="3em"></q-spinner>
    </q-inner-loading>
  </div>
</template>

<style>
/* .chart-wrap {
  height: 260px;
} */

.chart-container {
  max-width: 100%;
  max-height: 100%;
}
</style>

<script setup>
import { computed, toRefs, ref, watchEffect } from "vue";
import { formattedTotal } from "src/scripts/utils"

// Convertir props a variable
const props = defineProps(["data", "title", "width"]);
let { data, title, width } = toRefs(props);
const visible = ref(true);

watchEffect(() => {
  if (data.value[0]) {
    visible.value = false;
  }
  if (!data.value[0]) {
    visible.value = true;
  }
});




const seriesCalc = computed(() => {
  let series = [];

  data.value.forEach((cliente) => {
    series.push(parseFloat(cliente.monto));
  });

  return series;
});
const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Proporción créditos"
  }
  return `Proporción créditos - ${title.value}`
})

const optionsCalc = computed(() => {
  let options = {
    yaxis: {
      labels: {
        formatter: function (value) {
          return `${formattedTotal.format(value)}`;
        },
      },
    },

    title: {
      text: `${titleDefault.value}`,
      style: {
        color: "#4a148c",
        fontWeight: 600,
        fontSize: "14px",
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: 0,
              formatter: function (val) {
                return formattedTotal.format(val);
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "15px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              formatter: function (w) {
                return formattedTotal.format(
                  w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0)
                );
              },
            },
          },
        },
      },
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
            width: 100,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      show: false,
      position: "bottom",
      offsetY: 0,
      // height: 230,

    },
  };

  let labels = [];
  data.value.forEach((item) => {
    labels.push(`${item.cliente}`);
  });
  options.labels = labels;
  return options;
});
</script>

