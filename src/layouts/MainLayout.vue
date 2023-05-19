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
        <q-btn flat rounded color="dark" label="¿Quiénes Somos?"></q-btn>
        <q-btn flat rounded color="dark" label="Contacto"></q-btn>
        <q-btn flat rounded color="dark" label="Blog"></q-btn>

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
