<template>
    <NavBar />

    <v-container fluid>
       <v-row>
            <v-col>
                <v-alert v-show="dataError" text="Error al cargar documento" type="error"></v-alert>
                <v-alert v-show="dataSuccess" text="Documento cargado exitosamente" type="success"></v-alert>
                <v-alert v-show="flagAlert" :text="messageAlert" :type="typeAlert"></v-alert>
            </v-col>
        </v-row> 
    </v-container>

    <div id="upFiles" class="alineas">
        <v-fab
            color="primary"
            extended
            prepend-icon="mdi-cloud-upload"
            text="CARGAR DOCUMENTO"
            variant="outlined"
            @click="saveDoc('new', null)"
            v-if="isLogIn"
            :loading="isLoading"
            class="alineas"
        />
        <i v-else>Para Cargar Archivos primero debes iniciar sesión</i>

        <UpFile :enable="dialog" @close-popup="closePopup" @save-popup="savePopup" @flag-error="flagError" @flag-success="flagSuccess" :type="typeUpload" :item="idItem" />
    </div>
    
    <section id="tableDocs">
        <v-data-table class="table-px" v-if="isLogIn && docList.length > 0"
            :items-per-page="5"
            :pagination.sync="pagination"
        >
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header.value" class="text-left">{{ header.text }}</th>
                    <th class="text-left">Acciones</th> 
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in docList" :key="item.id">
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
                        <v-btn @click="seeDoc(item)" icon="mdi-file-eye-outline"></v-btn>
                        <v-btn @click="editDoc(item)" icon="mdi-pencil"></v-btn>
                        <v-btn @click="delDoc(item)" icon="mdi-delete"></v-btn>
                    </td>
                </tr>
            </tbody>
        </v-data-table>
        <div class="alineas" v-else>
            <i>Sin datos por mostrar</i>
        </div>
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
            style="margin-right: 2%;"
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
            style="margin-left: 2%;"
        >
            LISTA DOCS
        </v-btn>
    </section>

    <v-dialog v-model="modalOpen" max-width="600">
      <template v-slot:activator="{ on }"></template> 
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
        UpFile,
    },
	setup() {
		const store = useAppStore();
        const { isLogIn, docList } = storeToRefs(store);

        // las props
		let dialog = ref(false);
		let isLoading = ref(false);
		let typeUpload = ref('');
		let idItem = ref();

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
        const saveDoc = async (type, id) => {
            dialog.value = true
            isLoading.value = false
            typeUpload.value = type
            idItem.value = id
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
                await saveDoc('edit', data.id)
                // const payload = await store.EditDocsAct(data.id, file);
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
                const payload = await store.GetDocsListAct();
                console.log('payload XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', payload)
                console.log('payload.data XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', payload.data)
                console.log('payload.data[0] XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', payload.data[0])

                // docs.value = payload.data; //  los documentos están en payload.data
                // console.log('docs.value XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', docs.value)
                // console.log('docs.value[1] XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', docs.value[1])
                // console.log('docs.value[1].file_name XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', docs.value[1].file_name)

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
            // docs,
            seeDoc,
            editDoc,
            delDoc,
            // docu,
            fileViewer,
            modalOpen,
            flagAlert,
            messageAlert,
            typeAlert,
            alerts,
            downXls,
            docList,
            typeUpload,
            idItem,
            // pagination,
            // onPageChange,
            // onItemsPerPageChange,
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
    .table-px {
        height: 700px;
    }
</style>
