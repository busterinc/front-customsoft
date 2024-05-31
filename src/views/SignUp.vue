<template>
    <div>
        <NavBar />
        <br/><br/>
        <v-card class="mx-auto" style="max-width: 500px">
            <v-toolbar color="deep-purple-accent-4" cards dark flat>
                <v-btn icon @click="goBack">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-card-title class="text-h6 font-weight-regular">SignUp</v-card-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
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
                <v-text-field
                    v-model="name"
                    :rules="[rules.required]"
                    color="deep-purple"
                    label="Nombre"
                    variant="filled"
                />
                <v-text-field
                    v-model="email"
                    :rules="[rules.email]"
                    color="deep-purple"
                    label="Correo"
                    type="email"
                    variant="filled"
                />
                <v-checkbox
                    v-model="agreement"
                    :rules="[rules.required]"
                    color="deep-purple"
                >
                    <template v-slot:label>
                    Acepto los&nbsp;
                    <a href="#" @click="dialog = true">
                        Términos de servicios
                    </a>
                    &nbsp;y&nbsp;
                    <a href="#" @click="dialog = true">
                        Políticas de privacidad
                    </a>*
                    </template>
                </v-checkbox>
            </v-form>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn variant="text" @click="reset()">Limpiar</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    :disabled="!isValid"
                    :loading="isLoading"
                    color="deep-purple-accent-4"
                    @click="register"
                >
                    Registrar
                </v-btn>
            </v-card-actions>
            <v-dialog v-model="dialog" max-width="400" persistent>
                <v-card>
                    <v-card-title class="text-h5 bg-grey-lighten-3">Legal</v-card-title>
                    <v-card-text>
                    <b>Términos y Condiciones de Uso</b><br />
                    Al usar nuestra aplicación web, aceptas cumplir con nuestros términos
                    y condiciones. Esto incluye el uso responsable de la plataforma y el
                    respeto a la propiedad intelectual. No está permitido el uso indebido
                    de la información proporcionada en el sitio. Además, cualquier enlace
                    externo se proporciona solo como referencia y no respaldamos el
                    contenido de esos sitios.<br /><br />
                    
                    <b>Política de Privacidad:Política de Privacidad</b><br />
                    Nos comprometemos a proteger la privacidad de nuestros usuarios. La
                    información personal que recopilamos se utiliza únicamente para
                    proporcionar nuestros servicios y mejorar la experiencia del usuario.
                    No compartiremos su información con terceros sin su consentimiento, a
                    menos que sea requerido por ley. Implementamos medidas de seguridad
                    para proteger su información contra accesos no autorizados.
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn variant="text" @click="agreement = false, dialog = false">
                            No
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="deep-purple"
                            variant="tonal"
                            @click="agreement = true, dialog = false"
                        >
                            Si
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
  </template>
  
<script>
import NavBar from '@/components/NavBar.vue';
import { defineComponent } from 'vue';
import { useAppStore } from '../stores/app.js';
import { storeToRefs } from 'pinia'
  
export default defineComponent({
    components: {
      NavBar
    },
    setup() {
        const store = useAppStore();
      	const { isLogIn } = storeToRefs(store);

        const agreement = ref(false);
        const dialog = ref(false);
        const email = ref(undefined);
        const isValid = ref(false);
        const isLoading = ref(false);
        const password = ref(undefined);
        const name = ref(undefined);
    
        const rules = {
            email: v => !!(v || '').match(/@/) || 'Por favor introduzca un correo válido',
            length: len => v =>
            (v || '').length >= len ||
            `Longitud de carácter no válida, requiere ${len}`,
            password: v =>
            !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
            'La contraseña debe contener una letra mayúscula, un carácter numérico y un carácter especial.',
            required: v => !!v || 'Este campo es requerido',
        };
    
        const goBack = () => {
            // Lógica para retroceder
        };
    
        const register = () => {
            // Lógica para registrar
        };

        const reset = () => {
            agreement.value = false
            dialog.value = false
            email.value = undefined
            isValid.value = false
            isLoading.value = false
            password.value =undefined
            name.value = undefined
        };
    
        return {
            agreement,
            dialog,
            email,
            isValid,
            isLoading,
            password,
            name,
            rules,
            goBack,
            register,
            reset
        };
    }
});
</script>
  