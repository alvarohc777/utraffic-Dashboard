<template>
  <div>

    <apexchart type="radialBar" width="100%" :options="options" :series="[progress]" :key="options" />

  </div>
  <p class="text-h6 text-purple-10 text-center">{{ title }}
  </p>
</template>

<style>
.chart-wrap {
  height: 260px;

}
</style>

<script setup>

import { computed, reactive, ref, toRefs } from 'vue';

const props = defineProps(["progress", "title"]);
let { progress, title } = toRefs(props);



let options = reactive({

  chart: {
    type: 'radialBar',
    offsetY: -5,
    sparkline: {
      enabled: true
    }
  },
  // title: {
  //   text: `Hola`,
  //   style: {
  //     color: "#4a148c",
  //     fontWeight: 600,
  //     fontSize: "14px",
  //   }
  // },
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
