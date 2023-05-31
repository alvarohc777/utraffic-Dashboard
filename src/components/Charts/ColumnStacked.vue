<template>
  <apexchart :width="width" :options="options" :series="series" />
</template>
<style></style>

<script setup>
import { ref, reactive, toRefs, computed } from 'vue';
import { compactNumbers } from 'src/scripts/utils';
const props = defineProps(['series', 'categories', 'title'])
const { series, categories, title } = toRefs(props)

const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Proporción Pagos Realizados"
  }
  return `Pagos por cliente - ${title.value}`
})
let options = computed(() => {
  let options = {
    title: {
      text: `${titleDefault.value}`,
      style: {
        color: "#4a148c",
        fontWeight: 600,
        fontSize: "14px",
      }
    },

    chart: {
      type: 'bar',
      height: 260,
      stacked: true,
      toolbar: {
        show: true
      },

      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,

        dataLabels: {
          enabled: false,
          total: {
            formatter: function (value) {
              return compactNumbers.format(value);
            },
            enabled: true,
            style: {
              fontSize: '10px',
              fontWeight: 600,
            }
          }
        }
      },
    },
    xaxis: {
      type: 'datetime',
      categories: categories.value,
    },
    legend: {
      show: false,
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return compactNumbers.format(value);
        }
      }
    },
    dataLabels: {
      enabled: false
      // formatter: function (value) {
      //   return compactNumbers.format(value);
      // },
    }

  }
  return options
})


</script>
