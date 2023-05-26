<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white text-grey-8 window-width row justify-center items-center" height-hint="70">
        <router-link :to="{ name: 'dashboard' }">
          <q-btn flat rounded color="dark" label="Dashboard"></q-btn>
        </router-link>


        <router-link :to="{ name: 'cliente' }">
          <q-btn flat rounded color="dark" label="Cliente Stats"></q-btn>
        </router-link>
        <router-link :to="{ name: 'pruebas' }">
          <q-btn flat rounded color="dark" label="Pruebas"></q-btn>
        </router-link>
        <router-link :to="{ name: 'credits' }">
          <q-btn flat rounded color="dark" label="Creditos"></q-btn>
        </router-link>
        <router-link :to="{ name: 'asesor', params: { id: 10 } }">
          <q-btn flat rounded color="dark" label="Blog"></q-btn>
        </router-link>

        <q-btn unelevated rounded color="purple-10">
          <div>¿Ya Eres Cliente?</div>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
