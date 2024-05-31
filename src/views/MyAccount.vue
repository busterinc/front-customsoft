<template>
    <NavBar/>
    <v-card>
        <v-card-title>Datos Personales</v-card-title>
        <v-card-text v-if="user">
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.key" label="Id" readonly></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.name" label="Nombre" readonly></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.email" label="Email" readonly></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.password" label="Contraseña" readonly></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <div v-else style="text-align: center;">
            <i>Sin datos por mostrar - Recuerda iniciar sesión antes</i>
        </div>
    </v-card>
  </template>
  
<script>
import NavBar from '@/components/NavBar.vue';
import { defineComponent } from 'vue';
import { useAppStore } from '../stores/app.js';
import { storeToRefs } from 'pinia'
  
export default defineComponent({
    setup() {
        const store = useAppStore();
      	const { user } = storeToRefs(store);
    
        return {
            user
        };
    }
});
</script>
  