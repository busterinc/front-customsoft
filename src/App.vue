<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useAppStore } from './stores/app.js'; 

export default {
  setup() {
    const store = useAppStore();

    if (localStorage.getItem('logged')) store.LogIn();

    return store
  }
}
</script>
