<template>
  <div id="chart-timeline" class="chart-wrap">
    <apexchart type="area" width="400" ref="chart" :options="options" :series="series" :key="series"></apexchart>
    <q-inner-loading :showing="visible">
      <q-spinner color="primary" size="3em"></q-spinner>
    </q-inner-loading>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, watchEffect } from "vue";
const props = defineProps({ title: String, data: Array });
const { title, data } = toRefs(props);

const fechaMin = ref(data.value && data.value[0] && data.value[0][0]);
const visible = ref(true);

const titleDefault = computed(() => {
  if (title.value === null) {
    return "Histórico pagos"
  }
  return title.value
})
watchEffect(() => {
  if (data.value[0]) {
    visible.value = false;
  }
  if (!data.value[0]) {
    visible.value = true;
  }
});

const options = computed(() => {
  let optionsPrueba = {
    title: {
      text: `${titleDefault.value}`,
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
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
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
  };

  return optionsPrueba;
});
const series = computed(() => {
  return [
    {
      name: "Total recaudado",
      data: data.value,
    },

  ];
});
</script>

<style></style>
