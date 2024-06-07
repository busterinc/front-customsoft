<template>
  <li v-if="node && searchRslt.length === 0">
    <span :class="node.type === 'directory' ? 'folder' : 'file'">
      <i :class="node.type === 'directory' ? 'mdi mdi-folder' : 'mdi mdi-file'"></i>
      {{ node.name }}
      <v-btn
        class="delete-button"
        icon="mdi-delete"
        title="Eliminar"
        @click="node.type === 'file' ? deleteNodeFile(node) : deleteFolder(node)"
      />
      <v-btn
        class="rename-button"
        icon="mdi-pencil"
        title="Renombrar"
        v-if="!node.root"
        @click="node.type === 'file' ? renameNodeFile(node) : renameFolder(node)"
      /> 
      <v-btn
        class="add-folder-button"
        icon="mdi-folder-plus"
        @click="addFolder(node)"
        title="Añadir carpeta"
        v-if="node.type === 'directory'"
      />
      <v-btn
        class="add-file-button"
        icon="mdi-file-plus"
        @click="addFile(node)"
        title="Añadir archivo"
        v-if="node.type === 'directory'"
      />
    </span>
    <ul v-if="node.type === 'directory'">
      <TreeNode v-for="child in node.files" :key="child.id" :node="child" />
    </ul>
  </li>
  <div v-else-if="searchRslt" v-for="list in searchRslt" :key="list.id">
    <v-icon>{{ list.icon }}</v-icon>
    <i v-if="list.type === 'directory'">{{ list.name }} || {{ list.date }}</i>
    <i v-else>{{ list.name }} || {{ list.date }} || {{ list.extension }}</i>
  </div>
  <div v-else>
    --{{ node }}--
    <i>No existe ninguna carpeta o archivo</i>
    <v-btn
      class="add-folder-button"
      icon="mdi-folder-plus"
      @click="addRoot()"
      title="Añadir Root"
    />
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { ref, watch, watchEffect } from 'vue'; // Importa ref y watch de Vue

import {storeToRefs} from 'pinia'

export default {
  name: 'TreeNode',
  props: {
    node: Object,
    filter: String,
    search: String,
  },
  setup(props, { emit }) {
    const store = useAppStore();
    const { searchRslt } = storeToRefs(store);

    // const filt = ref(props.filter);
    // const srch = ref(props.search);
    const searchList = ref([]);
    

    const deleteFolder = async (node) => {
      const payload = await store.DelFoldAct(node);
      console.log('payload ____________________', payload)
      console.log('store.treeData ____________________', store.treeData);
    };

    const renameFolder = async (node) => {
      const newName = prompt('Ingrese el nuevo nombre:');
      if (newName) store.RenameFoldAct(node, newName);
    };

    const deleteNodeFile = async (node) => {
      store.DelFileAct(node);
    };

    const renameNodeFile = async (node) => {
      const newName = prompt('Ingrese el nuevo nombre:');
      if (newName) {
        const payload = store.RenameFileAct(node, newName);
        console.log('renameNodeFile payload...................', payload);
      }
    };

    const addFolder = async (parentNode) => {
      const folderName = prompt('Ingrese el nombre de la carpeta:');
      if (folderName) {
        const newFolder = await store.AddFoldAct(parentNode, folderName);
        console.log('addFolder newFolder...................', newFolder);
      }
    };

    const addFile = async (parentNode) => {
      const fileName = prompt('Ingrese el nombre del archivo:');
      if (fileName) {
        const newFile = await store.AddFileAct(parentNode, fileName);
        console.log('addFile newFile...................', newFile);
      }
    };

    const addRoot = async () => {
      const newRoot = await store.AddRootAct();
      console.log('addRoot newRoot...................', newRoot);
    };

    watchEffect( async () => {
      console.log('Node changed +++++++++++++++++++++++', props.node);
      console.log('Node changed +++++++++++++++++++++++', props.filter);
      console.log('Node changed +++++++++++++++++++++++', props.search);

      if (props.search) {
        const searchList = await store.GetSerachingAct(props.search)
        console.log('searchList +++++++++++++++++++++++', searchList);
      } else {
        store.searchRslt = [];
      }
    });

    // watch(() => props.filter, (newValue) => {
    //   console.log('newValue +++++++++++++++++++++++', newValue);
    //   filt.value = newValue;
    //   console.log('filt.value +++++++++++++++++++++++', filt.value);

    //   // filterNodes(filt.value);
    // });

    // watch(() => props.search, (newValue) => {
    //   console.log('newValue +++++++++++++++++++++++', newValue);
    //   srch.value = newValue;
    //   console.log('srch.value +++++++++++++++++++++++', srch.value);

    //   store.GetSerachingAct(newValue)
    // });

    return {
      deleteNodeFile,
      renameNodeFile,
      renameFolder,
      deleteFolder,
      addFolder,
      addFile,
      addRoot,
      searchRslt,
      // srch,
      // filt,
      searchList,
    };
  },
};
</script>

<style scoped>
  .delete-button {
    background-color: #ff0000;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .rename-button {
    background-color: #008000;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .add-folder-button {
    background-color: #3f51b5;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .add-file-button {
    background-color: #ff9800;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  li {
    margin-bottom: 5px;
  }

  span {
    display: block;
  }

  span.folder::before {
    content: "|-- ";
  }

  span.file::before {
    content: "|   |-- ";
  }
</style>
