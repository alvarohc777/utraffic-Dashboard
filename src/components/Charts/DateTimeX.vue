<template>
  <div id="chart-timeline">
    <apexchart :width="width" :options="options" :series="series" :key="series"></apexchart>
    <q-inner-loading :showing="visible">
      <q-spinner color="primary" size="3em"></q-spinner>
    </q-inner-loading>
  </div>
</template>

<style></style>

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

// const options = computed(() => {
//   let optionsPrueba = {
//     chart: {
//       height: 350,
//       type: 'line',
//       stacked: false
//     }
//   }
//   return optionsPrueba
// })





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
      // type: "line",
      height: 450,
      stacked: false,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    stroke: {
      width: [4, 4, 1]
    },



    dataLabels: {
      enabled: false,
    },
    // markers: {
    //   size: 0,
    //   style: "hollow",
    // },
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
      fixed: {
        enabled: true,
        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60
      },
      shared: true
    },

    tooltip: {
      shared: true,
      intersect: false,
    },
    // fill: {
    //   type: "gradient",
    //   gradient: {
    //     shadeIntensity: 1,
    //     opacityFrom: 0.7,
    //     opacityTo: 0.9,
    //     stops: [0, 100],
    //   },
    // },
    // stroke: {
    //   curve: 'stepline',
    // },

  };


  return optionsPrueba;
});



</script>


