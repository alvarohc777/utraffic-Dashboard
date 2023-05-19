<template>
  <div>

    <apexchart type="radialBar" width="100%" :options="options" :series="[progress]" :key="options" />

    <p class="text-subtitle2 text-center">{{ title }}
    </p>
  </div>
</template>

<style>
.chart-wrap {
  height: 260px;

}
</style>

<script setup>

import { computed, reactive, ref, toRefs } from 'vue';

const props = defineProps(["progress", "title", "score"]);
let { progress, title, score } = toRefs(props);

// const scoreColor = ref("red")
const scoreColor = computed(() => {
  if (!score.value) {
    return "#4a148c"
  }
  if (score.value <= 2) {
    return "#F90716"
  } else if (score.value <= 3) {
    return "#F6F54D"
  }
  return "#00FFD1"
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
      hollow: {
        margin: 0,
        size: '65%',
        background: '#fff',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24
        }
      },
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
  colors: [scoreColor.value],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]

    }
  },
  stroke: {
    lineCap: 'round'
  },

  labels: ['Average Results'],
})



</script>
