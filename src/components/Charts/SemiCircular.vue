<template>
  <div>

    <apexchart type="radialBar" width="150" :options="options" :series="[calificacionPorcentaje]" :key="options" />

  </div>
  <p class="text-subtitle2 text-purple-10"> Calificacion</p>
</template>

<style>
.chart-wrap {
  height: 260px;

}
</style>

<script setup>

import { computed, reactive, ref, toRefs } from 'vue';

const props = defineProps(["calificacion"]);
let { calificacion } = toRefs(props);
let calificacionPorcentaje = computed(() => {
  return calificacion.value * 100 / 5
})


let options = reactive({

  chart: {
    type: 'radialBar',
    offsetY: -5,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#e7e7e7",
        strokeWidth: '97%',
        margin: 5, // margin is in pixels
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          color: '#999',
          opacity: 1,
          blur: 2
        }
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          offsetY: 0,
          fontSize: '22px'
        }
      }
    }
  },
  grid: {
    padding: {
      top: 0
    }
  },
  colors: ['#4a148c'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#000',],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]

    }
  },

  labels: ['Average Results'],
})



</script>
