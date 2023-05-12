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

    <q-inner-loading
      :showing="visible"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    >
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
  currency: "USD",
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
              label: "Total",
              fontSize: "15px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              formatter: function (w) {
                return USDollar.format(
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

