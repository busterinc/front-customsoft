<template>
    <div class="pa-4 text-center" id="PopUpFile">
      <v-dialog v-model="active" max-width="600">
        <v-card prepend-icon="mdi-account" title="Cargar Documento">
          <v-card-text>
            <v-row dense>
              <v-file-input
                label="ejemplo.pdf (*.PDF | *.PNG | *.JPG | *.JPGE)"
                chips
                multiple
                v-model="attachFile"
              ></v-file-input>
            </v-row>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="cerrar" variant="plain" @click="close"></v-btn>
            <v-btn
              color="primary"
              text="guardar"
              variant="tonal"
              @click="save()"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'; // Importa ref y watch de Vue
  import { defineComponent } from 'vue';
  import { useAppStore } from '../stores/app.js';
  // import { storeToRefs } from 'pinia'
  
  export default defineComponent({
    name: 'UpFile',
    props: {
      enable: Boolean,
      type: Text,
      item: Number
    },
    setup(props, { emit }) {
      const store = useAppStore();
      // const { token } = storeToRefs(store);
  
      // props
      const active = ref(props.enable);
      const tipo = ref(props.type);
      const key = ref(props.item);
      const isLoad = ref(false);

      // data
      const attachFile = ref([])
  
      // Escucha los cambios en la propiedad 'enable'
      watch(() => props.enable, (newValue) => {
        active.value = newValue;
      });
      // Observar cambios en la prop 'type'
      watch(() => props.type, (newValue) => {
        console.log('newValue ::::::::::::::::::::::::::::', newValue)
        tipo.value = newValue;
      });
      // Observar cambios en la prop 'item'
      watch(() => props.item, (newValue) => {
        console.log('newValue ::::::::::::::::::::::::::::', newValue)
        key.value = newValue;
      });

  
      const close = () => {
        emit('close-popup');
      };
  
      const save = async () => {
        emit('close-popup');
        emit('save-popup');
  
        try {
          console.log('attachFile __________________', attachFile)
          console.log('attachFile.value __________________', attachFile.value)
          console.log('attachFile.value[0] __________________', attachFile.value[0])
          const payload = await store.UpFileAct(attachFile.value[0], tipo.value, key.value) // Action para cargar docs
          console.log('payload __________________', payload);

          if (payload.uploadData) {
            emit('flag-success', true);
            setTimeout(() => {
              emit('flag-success', false);
            }, 2000);
          } else {
            emit('flag-error', true);
            setTimeout(() => {
              emit('flag-error', false);
            }, 2000);
          }
        } catch (error) {
          console.error('Error to upload file:', error);
          emit('flag-error', true);
          setTimeout(() => {
            emit('flag-error', false);
          }, 2000);
        }
      };
  
      return {
        active,
        isLoad,
        close,
        save,
        attachFile,
        key,
        tipo
      };
    }
  });
</script>
