<template>
  <q-page>
    <h1>hola</h1>
    <p>{{ route.params }}</p>
  </q-page>
</template>

<style></style>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
console.log(route)
const props = defineProps(['id'])
const id = ref(props.id)


</script>
