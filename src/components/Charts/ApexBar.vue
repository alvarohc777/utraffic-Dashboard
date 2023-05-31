<template>
  <apexchart :width="width" :options="options" :series="series" :key="series" />
</template>
<style></style>

<script setup>
import { compactNumbers } from 'src/scripts/utils';
import { toRefs, computed, ref, onMounted, reactive } from 'vue';

const props = defineProps(['series', 'categories', 'title']);
let { series, categories, title } = toRefs(props)

// const series = ref([{ data: data.value[1] }])

// const series = computed(() => {
//   return [{ data: data.value && data.value[1] }]
// })

const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Total créditos"
  }
  return `Monto Total por cliente - ${title.value}`
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
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },

    xaxis: {
      categories: categories.value,
      labels: {
        formatter: function (value) {
          return compactNumbers.format(value);
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return compactNumbers.format(value);
        }
      },
    }
  }

  return options
}
)

</script>
