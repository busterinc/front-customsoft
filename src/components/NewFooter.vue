<template>
    <v-footer class="d-flex flex-column">
      <div class="bg-teal d-flex w-100 align-center px-4">
        <strong>Contáctanos en nuestras redes sociales</strong>
  
        <v-spacer></v-spacer>
  
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4"
          size="small"
          variant="plain"
        ></v-btn>
      </div>
  
      <div class="px-4 py-2 bg-black text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Angel Ro.</strong>
      </div>
    </v-footer>
  </template>
  <script>
    export default {
      data: () => ({
        icons: [
          'mdi-facebook',
          'mdi-twitter',
          'mdi-linkedin',
          'mdi-instagram',
        ],
      }),
    }
  </script>