<template>
    <NavBar/>
    <br/><br/>

    <v-alert v-show="flagAlert" closable :text="messageAlert" :type="typeAlert" variant="tonal"></v-alert>
    <!-- <v-alert v-show="true" closable text="Error al cargar documento" type="error" variant="tonal"></v-alert> -->

    <v-card class="mx-auto" style="max-width: 500px">
        <v-toolbar color="deep-purple-accent-4" cards dark flat>
            <v-btn icon>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-card-title class="text-h6 font-weight-regular"> SignIn </v-card-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
            <v-text-field
              v-model="email"
              :rules="[rules.email]"
              color="deep-purple"
              label="Correo"
              type="email"
              variant="filled"
            />
            <v-text-field
              v-model="password"
              :rules="[rules.password, rules.length(6)]"
              color="deep-purple"
              counter="6"
              label="Contraseña"
              style="min-height: 96px"
              type="password"
              variant="filled"
            />
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn variant="text" @click="form.reset()"> Limpiar </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :disabled="!isValid"
                :loading="isLoading"
                color="deep-purple-accent-4"
				@click="logIn"
            >
                aceptar
            </v-btn>
        </v-card-actions>
    </v-card>
    <br/><br/>
    <p class="centered">
      Aún no tienes cuenta?
      <router-link to="/sign-up" class="">Crear Cuenta</router-link>
    </p>
</template>
  
<script>
import { useAppStore } from '../stores/app.js'
import NavBar from '@/components/NavBar.vue';
import {storeToRefs} from 'pinia'
import router from '../router'

export default {
    components: {
        NavBar
    },
	setup() {
		const store = useAppStore();

        const { dataSession, token, superUser, isLogIn } = storeToRefs(store);

		const email = ref(undefined);
		const password = ref(undefined);
		const isValid = ref(false);
		const isLoading = ref(false);

        const flagAlert = ref(false);
        const messageAlert = ref('');
        const typeAlert = ref('');

		const rules = {
			email: v => !!(v || '').match(/@/) || 'Por favor introduzca un correo válido',
			length: len => v => (v || '').length >= len || `Longitud de carácter no válida, requiere ${len}`,
			password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
				'La contraseña debe contener una letra mayúscula, un carácter numérico y un carácter especial.',
			required: v => !!v || 'Este campo es requerido',
		};

		const logIn = async () => {
			try {
                isLoading.value = true
				console.log('email __________________', email.value)
				console.log('password __________________', password.value)
				const respToken = await store.GetTokenAct();    // Action para generar token
				console.log('respToken __________________', respToken)
				console.log('store.dataSession __________________', store.dataSession)
				console.log('store.token __________________', store.token)
				console.log('store.superUser __________________', store.superUser)
				const logInResp = await store.GetSignInAct(email.value, password.value);    // Action para generar token
				console.log('logInResp __________________', logInResp)
                console.log('store.isLogIn __________________', store.isLogIn)
                isLoading.value = false

                await alerts(true, store.isLogIn ? 'Inicio de sesión exitoso' : 'Compruebe que su correo y/o contraseña sean correctos', store.isLogIn ? 'success' : 'error')
                if (store.isLogIn) {
                    setTimeout(() => {
                        router.push('/')
                    }, 1500);
                }
			} catch (error) {
                await alerts(true, 'Error al iniciar sesión', 'error')
				console.error('Error al iniciar sesión:', error);
			}
		};

        const alerts = async (enable, mess, type) => {
            flagAlert.value = enable
            messageAlert.value = mess
            typeAlert.value = type

            setTimeout(() => {
                flagAlert.value = false
                messageAlert.value = ''
                typeAlert.value = ''
            }, 3000);
        }

		return {
			email,
			password,
			isValid,
			isLoading,
			rules,
			logIn,
            isLoading,
            isLogIn,
            alerts,
            flagAlert,
            messageAlert,
            typeAlert,
		};
	}
};
</script>

<style scoped>
	.centered {
		text-align: center;
	}
</style>
