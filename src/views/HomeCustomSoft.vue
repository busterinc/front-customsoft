<template>
    <NavBar />
    <v-parallax
      :src="cover"
    >
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">
                CustomSoft Statements
            </h1>
            <h4 class="subheading">
                Analiza tus Estados de cuenta                
                <br/><br/>

                <v-btn
                    class="text-none"
                    append-icon="mdi-arrow-right"
                    variant="text"
                    border
                    outlined
                    rounded="xl"
                    @click="navToUpload"
                >
                    COMENZAR
                </v-btn>

                <!-- <v-fab
                    color="primary"
                    extended
                    prepend-icon="mdi-cloud-upload"
                    text="CARGAR DOCUMENTO"
                    variant="outlined"
                    @click="saveDoc()"
                    v-if="isLogIn"
                    :loading="isLoading"
                />
                <i v-else>Para Cargar Archivos primero debes iniciar sesión</i> -->
            </h4>
        </div>
    </v-parallax>

    <UpFile :enable="dialog" @close-popup="closePopup" @save-popup="savePopup" />
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { useRouter } from 'vue-router'; // Importar el enrutador
// import UpFile from '@/components/UploadPopUp.vue';

// import { useAppStore } from '../stores/app.js'
// import {storeToRefs} from 'pinia'

export default {
	name: 'Home',
    components: {
        NavBar,
        // UpFile
    },
	setup() {
		// const store = useAppStore();
        // const { token, isLogIn } = storeToRefs(store);

		// let dialog = ref(false);
		// let isLoading = ref(false);
        const cover = 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'

        // const closePopup = async () => {
        //     console.log('dialog.value __________________', dialog.value)
        //     console.log('dialo __________________', dialog)
        //     dialog.value = false
        //     console.log('dialog.value __________________', dialog.value)
        //     console.log('dialog __________________', dialog)
        // }
        // const savePopup = async () => {
        //     isLoading.value = true
        // }
        // const saveDoc = async () => {
        //     dialog.value = true
        //     isLoading.value = false
        // }
        const router = useRouter(); // Obtener el enrutador
        const navToUpload = () => {
            router.push('/upload-files'); // Redirigir al usuario a la ruta 'upload-files'
        };

		return {
			// closePopup,
			// savePopup,
			// saveDoc,
            // dialog,
            // isLoading,
            cover,
            // isLogIn
            navToUpload,
		};
	}
}
</script>
