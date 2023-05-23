<template>
  <div id="chart-timeline" class="chart-wrap">
    <apexchart type="area" :width="width" ref="chart" :options="options" :series="series" :key="series"></apexchart>
    <q-inner-loading :showing="visible">
      <q-spinner color="primary" size="3em"></q-spinner>
    </q-inner-loading>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, watchEffect } from "vue";
import { compactNumbers } from "src/scripts/utils"
const props = defineProps(["title", "series", "width"]);
const { title, series, width } = toRefs(props);

const fechaMin = ref(series.value && series.value[0] && series.value[0][0]);
const visible = ref(true);

const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Histórico pagos"
  }
  return title.value
})
watchEffect(() => {
  if (series.value[0]) {
    visible.value = false;
  }
  if (!series.value[0]) {
    visible.value = true;
  }
});



const options = computed(() => {
  let optionsPrueba = {
    title: {
      text: `${titleDefault.value}`,
      style: {
        color: "#4a148c",
        fontWeight: 600,
        fontSize: "14px",
      }
    },


    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#999",
          label: {
            show: true,
            text: "Recaudo",
            style: {
              color: "#fff",
              background: "#e28743",
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      min: fechaMin.value,
      tickAmount: 6,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return compactNumbers.format(value);
        }
      }
    },

    tooltip: {
      shared: true,
      intersect: false,

      y: {
        formatter: "hola"
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: 'stepline',
    },

  };


  return optionsPrueba;
});



</script>

<style></style>
