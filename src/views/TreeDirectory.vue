<template>
    <div>
        <NavBar />
        <div>
            <h2>Árbol de archivos</h2>
            <ul>
              <TreeNode :node="treeData" />
              <!-- <TreeNode :node="treeData.files.length > 0 && treeData.root ? treeData : null" /> -->
            </ul>
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
  
      return {
        treeData,
      };
    },
});
</script>
  