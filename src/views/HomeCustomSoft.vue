<template>
    <NavBar />
    <v-parallax
      :src="cover"
    >
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">
                CustomSoft File Manager
            </h1>
            <h4 class="subheading">
                Carga tus archivos y gestiona tu información con grán facilidad.                
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
            </h4>
        </div>
    </v-parallax>

    <UpFile :enable="dialog" @close-popup="closePopup" @save-popup="savePopup" />
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { useRouter } from 'vue-router'; // Importar el enrutador

export default {
	name: 'Home',
    components: {
        NavBar,
    },
	setup() {
        const cover = 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'

        const router = useRouter(); // Obtener el enrutador
        const navToUpload = () => {
            router.push('/upload-files'); // Redirigir al usuario a la ruta 'upload-files'
        };

		return {
            cover,
            navToUpload,
		};
	}
}
</script>
