<template>
  <apexchart :width="width" :options="options" :series="series" :key="series"></apexchart>
  <!-- <p>{{ series }}</p> -->
</template>
<style></style>

<script setup>
import { compactNumbers } from 'src/scripts/utils';
import { reactive, ref, toRefs } from 'vue';
const props = defineProps(['series'])
const { series } = toRefs(props)

let options = reactive({

  chart: {
    height: 350,
    type: 'bar'
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
})


</script>
