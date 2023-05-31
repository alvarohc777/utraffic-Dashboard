<template>
  <q-page>
    <h1>hola</h1>
    <p>{{ id }}</p>
  </q-page>
</template>

<style></style>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
const route = useRoute()
const router = useRouter()
console.log(route)
const props = defineProps(['id'])
const id = ref(props.id)
const $q = useQuasar();
onMounted(() => {
  id.value = $q.sessionStorage.getItem("asesorId")
  console.log(id.value)
})

</script>
