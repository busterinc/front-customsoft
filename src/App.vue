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

    const id = localStorage.removeItem('id');
    const user = localStorage.removeItem('user');
    const token = localStorage.removeItem('token');
    const logged = localStorage.removeItem('logged');
      
    if (token || id|| logged || user ) store.LogIn();

    return store
  }
}
</script>
