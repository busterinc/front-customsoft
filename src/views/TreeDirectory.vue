<template>
    <div>
        <NavBar />
        <div>
            <h2>Árbol de archivos</h2>
            <ul>
                <TreeNode :node="treeData" />
            </ul>
            <v-btn
                class="text-none"
                append-icon="mdi-directory"
                variant="outlined"
                rounded="xl"
                @click="addDirectory"
                extended
            >
                Agregar directorio
            </v-btn>
            <v-btn
                class="text-none"
                append-icon="mdi-file"
                variant="outlined"
                rounded="xl"
                @click="addFile"
                extended
            >
                Agregar archivo
            </v-btn>
        </div>  
    </div>
  </template>
  
<script>
import { defineComponent } from 'vue';
import { useAppStore } from '../stores/app.js';
import NavBar from '@/components/NavBar.vue';
import TreeNode from '@/components/TreeNode.vue';

export default defineComponent({
    name: 'TreeComponent',
    components: {
      NavBar,
      TreeNode,
    },
    setup() {
      const store = useAppStore();
      const { treeData } = store;
  
      const addDirectory = () => {
        store.addDirectoryToTree();
      };
  
      const addFile = () => {
        store.addFileToTree();
      };
  
    //   const deleteNode = (node) => {
    //     store.deleteNode(node);
    //   };
  
    //   const renameNode = (node, newName) => {
    //     store.renameNode(node, newName);
    //   };
  
      return {
        treeData,
        addDirectory,
        addFile,
        // deleteNode,
        // renameNode,
      };
    },
});
</script>
  