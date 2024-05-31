<template>
    <NavBar />

    <v-alert v-show="dataError" closable text="Error al cargar documento" type="error" variant="tonal"></v-alert>
    <v-alert v-show="dataSuccess" closable text="Documento cargado exitosamente" type="success" variant="tonal"></v-alert>

    <v-alert v-show="flagAlert" closable :text="messageAlert" :type="typeAlert" variant="tonal"></v-alert>

    <section id="upFiles" class="alineas">
        <v-fab
            color="primary"
            extended
            prepend-icon="mdi-cloud-upload"
            text="CARGAR DOCUMENTO"
            variant="outlined"
            @click="saveDoc()"
            v-if="isLogIn"
            :loading="isLoading"
        />
        <i v-else>Para Cargar Archivos primero debes iniciar sesión</i>

        <UpFile :enable="dialog" @close-popup="closePopup" @save-popup="savePopup" @flag-error="flagError" @flag-success="flagSuccess" />
    </section>
    
    <section id="tableDocs">
        <v-table height="300px" v-if="isLogIn">
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header.value" class="text-left">{{ header.text }}</th>
                    <th class="text-left">Acciones</th> <!-- Nueva columna para acciones -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in docs[0] ? docs : docu" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.created_at }}</td>
                    <td>{{ item.file_name }}</td>
                    <td>{{ item.xtension }}</td>
                    <td>{{ item.size }}</td>
                    <td>
                        <div class="truncate-text">
                            <a :href="item.bucket_url" target="_blank">{{ item.bucket_url }}</a>
                        </div>
                    </td>
                    <td>
                        <!-- Botones para editar, ver documento y eliminar documento -->
                        <v-btn @click="seeDoc(item)" icon="mdi-file-eye-outline"></v-btn>
                        <v-btn @click="editDoc(item)" icon="mdi-pencil"></v-btn>
                        <v-btn @click="delDoc(item)" icon="mdi-delete"></v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-table class="alineas" v-else>
            <i>Sin datos por mostrar</i>
        </v-table>
    </section>

    <section class="alineas">
        <v-btn
            class="text-none"
            append-icon="mdi-cloud-download"
            variant="outlined"
            rounded="xl"
            @click="downXls('log')"
            color="primary"
            extended
        >
            LOG
        </v-btn>
        <v-btn
            class="text-none"
            append-icon="mdi-cloud-download"
            variant="outlined"
            rounded="xl"
            @click="downXls('docs')"
            color="primary"
            extended
        >
            LISTA DOCS
        </v-btn>
    </section>
    

    <!-- Iframe para visualizar el archivo --><!-- Modal -->
    <v-dialog v-model="modalOpen" max-width="600">
      <template v-slot:activator="{ on }"></template> <!-- No mostramos el activator -->
      <v-card>
        <v-card-title>Visor de Archivo</v-card-title>
        <v-card-text>
            <iframe :src="fileViewer" style="width: 100%; height: 500px; border: none;"></iframe>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="modalOpen = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import UpFile from '@/components/UploadPopUp.vue';

import { useAppStore } from '../stores/app.js'
import {storeToRefs} from 'pinia'

export default {
	name: 'Home',
    components: {
        NavBar,
        UpFile
    },
	setup() {
		const store = useAppStore();
        const { isLogIn } = storeToRefs(store);

        // las props
		let dialog = ref(false);
		let isLoading = ref(false);
        let docs = ref([])
        let fileViewer = ref('')
		let modalOpen = ref(false);

        let flagAlert = ref(false);
        let messageAlert = ref('');
        let typeAlert = ref('');

        // Headers de la tabla
        const headers = [
            { text: 'ID', value: 'id' },
            { text: 'Created At', value: 'created_at' },
            { text: 'File Name', value: 'file_name' },
            { text: 'Extension', value: 'xtension' },
            { text: 'Size', value: 'size' },
            { text: 'Bucket URL', value: 'bucket_url' },
        ];

        const docu = [ { "id": 3, "created_at": "2024-05-28T21:33:42.726169+00:00", "profile_id": "da9fbcbd-ef35-4fa6-989c-8bd1a56a87af", "file_name": "ejemplo_pdf.pdf", "xtension": "pdf", "size": "190569", "bucket_url": "https://lakcpegdxivxpkjmiulo.supabase.co/storage/v1/object/public/raikou/4d9233ccfe1230c0ab0566ca258ea24f" }, { "id": 4, "created_at": "2024-05-28T21:38:41.395778+00:00", "profile_id": "da9fbcbd-ef35-4fa6-989c-8bd1a56a87af", "file_name": "ejemplo_pdf.pdf", "xtension": "pdf", "size": "190569", "bucket_url": "https://lakcpegdxivxpkjmiulo.supabase.co/storage/v1/object/public/raikou/4d9233ccfe1230c0ab0566ca258ea24f" }, { "id": 5, "created_at": "2024-05-28T21:42:58.979276+00:00", "profile_id": "da9fbcbd-ef35-4fa6-989c-8bd1a56a87af", "file_name": "ejemplo_pdf.pdf", "xtension": "pdf", "size": "190569", "bucket_url": "https://lakcpegdxivxpkjmiulo.supabase.co/storage/v1/object/public/raikou/a4289699d8e1469e52aef228c89710c4" }, { "id": 6, "created_at": "2024-05-28T23:29:17.240863+00:00", "profile_id": "da9fbcbd-ef35-4fa6-989c-8bd1a56a87af", "file_name": "ejemplo_pdf.pdf", "xtension": "pdf", "size": "190569", "bucket_url": "https://lakcpegdxivxpkjmiulo.supabase.co/storage/v1/object/public/raikou/ac589b5cb85e4254d228857294116e6f" }, { "id": 7, "created_at": "2024-05-28T23:29:21.064649+00:00", "profile_id": "da9fbcbd-ef35-4fa6-989c-8bd1a56a87af", "file_name": "ejemplo_pdf.pdf", "xtension": "pdf", "size": "190569", "bucket_url": "https://lakcpegdxivxpkjmiulo.supabase.co/storage/v1/object/public/raikou/3cbfd9a5e1ef2e8279d2853792b308c4" }, { "id": 8, "created_at": "2024-05-30T03:03:48.039367+00:00", "profile_id": "da9fbcbd-ef35-4fa6-989c-8bd1a56a87af", "file_name": "ejemplo_pdf.pdf", "xtension": "pdf", "size": "190569", "bucket_url": "https://lakcpegdxivxpkjmiulo.supabase.co/storage/v1/object/public/raikou/18a66a3593da0a1bfec39e387192bc30" } ]

        // data
        const dataSuccess = ref('');
        const dataError = ref('');
        // const docs = ref([]);
        const cover = 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'

        const closePopup = async () => {
            console.log('dialog.value __________________', dialog.value)
            console.log('dialo __________________', dialog)
            dialog.value = false
            console.log('dialog.value __________________', dialog.value)
            console.log('dialog __________________', dialog)
        }
        const savePopup = async () => {
            isLoading.value = true
        }
        const saveDoc = async () => {
            dialog.value = true
            isLoading.value = false
        }
        const flagSuccess = async (data) => {
            console.log('flagSuccess data ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬', data)
            isLoading.value = false
            dataSuccess.value = data
        }
        const flagError = async (data) => {
            console.log('flagError data ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬', data)
            isLoading.value = false
            dataError.value = data
        }

        // Acciones para interactuar con los documentos
        const seeDoc = async (data) => {
            // Lógica para ver el documento
            console.log('seeDoc data sssssssssssssssssssssssssssssssss', data)
            try {
                fileViewer.value = data.bucket_url;
                modalOpen.value = true;
            } catch (error) {
                console.error('Error al cargar el documento:', error);
                modalOpen.value = false;
            }
        };

        const editDoc = async (data) => {
            // Lógica para editar el documento
            console.log('editDoc data eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', data)
            try {
                await saveDoc()
                // const payload = await store.EditDocsAct(data.id, file);
                // console.log('dirtDoc payload eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', payload)
                await alerts(true, 'Se editó documento exitosamente', 'success')
            } catch (error) {
                console.error('Error edit document:', error);
                await alerts(true, 'Error al editar documento', 'error')
            }
        };

        // Llamar al action fetchDocuments cuando se monte el componente
        const delDoc = async (data) => {
            // Lógica para eliminar el documento
            console.log('delDoc data ddddddddddddddddddddddddddddddddd', data)
            try {
                const payload = await store.DelDocsAct(data.id);
                console.log('delDoc payload ddddddddddddddddddddddddddddddddd', payload)
                if (payload.message) await alerts(true, 'Se eliminó documento exitosamente', 'success')
            } catch (error) {
                console.error('Error delete document:', error);
                await alerts(true, 'Error al eliminar documento', 'error')
            }
        };

        const downXls = async (type) => {
            store.DownloadXlsAct(type)
        }

        onMounted(async () => {
            isLoading.value = true;
            try {
                const payload = await store.GetDocsAct();
                console.log('payload XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', payload)
                console.log('payload.data XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', payload.data)
                console.log('payload.data[0] XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', payload.data[0])

                docs.value = payload.data; // Supongo que los documentos están en payload.data
                console.log('docs.value XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', docs.value)
                console.log('docs.value[1] XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', docs.value[1])
                console.log('docs.value[1].file_name XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', docs.value[1].file_name)

                isLoading.value = false;
            } catch (error) {
                console.error('Error fetching documents:', error);
                isLoading.value = false;
            }
        });

        const alerts = async (enable, mess, type) => {
            flagAlert.value = enable
            messageAlert.value = mess
            typeAlert.value = type

            setTimeout(() => {
                flagAlert.value = false
                messageAlert.value = ''
                typeAlert.value = ''
            }, 2000);
        }

		return {
			closePopup,
			savePopup,
			saveDoc,
            dialog,
            isLoading,
            cover,
            isLogIn,
            flagSuccess,
            flagError,
            dataSuccess,
            dataError,
            headers,
            docs,
            seeDoc,
            editDoc,
            delDoc,
            docu,
            fileViewer,
            modalOpen,
            flagAlert,
            messageAlert,
            typeAlert,
            alerts,
            downXls,
		};
	}
}
</script>

<style scoped>
    .alineas {
        text-align: center;
        margin-top: 2%;
    }
    .truncate-text {
        max-width: 200px; /* Ancho máximo para la URL */
        white-space: nowrap; /* Evita que el texto se divida en varias líneas */
        overflow: hidden; /* Oculta el texto que se desborda del contenedor */
        text-overflow: ellipsis; /* Agrega puntos suspensivos para indicar que el texto ha sido truncado */
    }
</style>
