<template>
  <apexchart :width="width" :options="options" :series="series" :key="series"></apexchart>
  <!-- <p>{{ series }}</p> -->
</template>
<style></style>

<script setup>
import { compactNumbers } from 'src/scripts/utils';
import { reactive, ref, toRefs, computed } from 'vue';
const props = defineProps(['series', 'title'])
const { series, title } = toRefs(props)
const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Pagos realizados"
  }
  return `Pagos - ${title.value}`
})
let options = reactive({

  chart: {
    height: 250,
    type: 'bar'
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
    bar: {
      columnWidth: '60%'
    }
  },
  colors: ['#00E396'],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['Proyectado', 'Recaudado'],
    markers: {
      fillColors: ['#00E396', '#775DD0']
    }
  },
  xaxis: {
    type: "datetime",

    tickAmount: 6,
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return compactNumbers.format(value);
      }
    }
  },
  legend: {
    show: false,
    position: "bottom",
    offsetY: 0,
  },
})


</script>
