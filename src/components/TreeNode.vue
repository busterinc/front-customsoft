<template>
  <li>
    <span :class="{ 'folder': node.type.includes('directory') }">
      {{ node.name }}
      <!-- <v-btn
        v-if="node.type === 'file'"
        class="delete-button"
        icon="mdi-delete"
        @click="node.type === 'file' ? deleteNodeFile(node) : deleteNode(node)"
      />
      <v-btn
        v-if="node.type === 'file'"
        class="rename-button"
        icon="mdi-pencil"
        @click="node.type === 'file' ? renameNodeFile(node) : renameNode(node)"
      /> -->
      <v-btn
        class="delete-button"
        icon="mdi-delete"
        @click="node.type === 'file' ? deleteNodeFile(node) : deleteFolder(node)"
      />
      <v-btn
        class="rename-button"
        icon="mdi-pencil"
        @click="node.type === 'file' ? renameNodeFile(node) : renameFolder(node)"
      />
      <!-- <v-btn v-if="node.type === 'file'" class="delete-button" icon="mdi-delete" @click="deleteNode(node)" />
      <v-btn v-if="node.type === 'file'" class="rename-button" icon="mdi-pencil" @click="renameNode(node)" /> -->    
    </span>
    <ul v-if="node.type === 'directory'">
      <TreeNode v-for="child in node.files" :key="child.id" :node="child" />
    </ul>
  </li>
</template>

<script>
import { useAppStore } from '../stores/app.js';
// import { storeToRefs } from 'pinia'

export default {
  name: 'TreeNode',
  props: {
    node: Object,
  },
  setup(props, { emit }) {
    const store = useAppStore();
    // const { treeData } = storeToRefs(store);

    // const deleteNode = (node) => {
    //   store.DelNodeAct(node)
    // }
    // const renameNode = (node) => {
    //   const newName = prompt('Ingrese el nuevo nombre:');
    //   console.log('renameNode node...................', node)
    //   console.log('renameNode newName...................', newName)

    //   if (newName) store.RenameNodeAct(node, newName)
    // }
    const deleteFolder = async (node) => {
      const payload = await store.DelFoldAct(node)
      console.log('deleteFolder payload +++++++++++++++++', payload)
      if (payload.type === 'directory' && payload.name === 'root') props.node = payload.treeData
    }
    const renameFolder = async (node) => {
      const newName = prompt('Ingrese el nuevo nombre:');
      console.log('renameFolder node...................', node)
      console.log('renameFolder newName...................', newName)

      if (newName) store.RenameFoldAct(node, newName);
    }
    const deleteNodeFile = async (node) => {
      store.DelFileAct(node);
    }
    const renameNodeFile = async (node) => {
      const newName = prompt('Ingrese el nuevo nombre:');
      console.log('renameNodeFile node...................', node)
      console.log('renameNodeFile newName...................', newName)

      if (newName) {
        const payload = store.RenameFileAct(node, newName);
        console.log('renameNodeFile payload...................', payload)
      }
    }

    watchEffect(() => {
      // Acciones que deseas realizar cuando `node` cambie
      console.log('Node changed:', props.node);
      // Por ejemplo, aquí podrías ejecutar una acción específica
    });

    return {
      deleteNodeFile,
      renameNodeFile,
      // deleteNode,
      // renameNode,
      renameFolder,
      deleteFolder,
    }
  }
};
</script>

<style scoped>
  .delete-button {
    background-color: #ff0000; /* Cambia el color del botón de eliminar */
    color: #ffffff; /* Cambia el color del texto del botón de eliminar */
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .rename-button {
    background-color: #008000; /* Cambia el color del botón de renombrar */
    color: #ffffff; /* Cambia el color del texto del botón de renombrar */
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
  }

  ul {
    list-style-type: none;
    padding-left: 20px; /* Ajusta el espacio a la izquierda */
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
