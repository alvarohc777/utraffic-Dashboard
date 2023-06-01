<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white text-grey-8 window-width row justify-center items-center" height-hint="70">

        <router-link :to="{ name: 'credits' }">
          <q-btn unelevated rounded color="purple-10" label="Dashboard"></q-btn>
        </router-link>


      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
