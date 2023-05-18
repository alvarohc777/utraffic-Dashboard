<template>
  <div class="chart-wrap relative-position">
    <div>
      <apexchart type="donut" width="250" :options="optionsCalc" :series="series" :key="series"></apexchart>
    </div>

    <q-inner-loading :showing="visible" label="Please wait..." label-class="text-teal" label-style="font-size: 1.1em">
      <q-spinner color="primary" size="3em"></q-spinner>
    </q-inner-loading>
  </div>
</template>

<style>
.chart-wrap {
  height: 260px;
}
</style>

<script setup>
import { computed, toRefs, ref, watchEffect } from "vue";

// Convertir props a variable
const props = defineProps({ series: Object, title: String });
let { series, title } = toRefs(props);
const visible = ref(true);

watchEffect(() => {
  if (series.value[0]) {
    visible.value = false;
  }
  if (!series.value[0]) {
    visible.value = true;
  }
});
let USDollar = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
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
                return USDollar.format(val);
              },
            },
            total: {
              show: true,
              label: "Aporte",
              fontSize: "15px",
              fontFamily: " Arial, sans-serif",
              fontWeight: 600,
              formatter: function (w) {
                let value1 = w.globals.seriesTotals[0]
                let value2 = w.globals.seriesTotals[1]
                return (value1 / (value1 + value2)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })
              },
            },
          },
        },
      },
    },

    labels: [title.value, "Otras"],
    chart: {
      width: 0,
      type: "donut",
      offsetY: 20,
      height: 230,
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
      show: false,
      // position: "right",
      // offsetY: 0,
      // height: 230,
    },
  };



  return options;
});
</script>

