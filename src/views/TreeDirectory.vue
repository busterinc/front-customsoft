<template>
  <div>
    <NavBar />
    {{ filtered }} / {{ searched }} / {{ selected }} / {{ treeData }}
    <div>
      <h2>Árbol de archivos</h2>

      <!-- <v-col
          v-for="(slct, i) in selected"
        :key="i"
        class="py-1 pe-0"
        cols="auto"
      >
        <v-chip
          :disabled="loading"
          closable
          @click:close="selected.splice(i, 1)"
        >
          {{ slct }}
        </v-chip>
      </v-col> -->

      <div class="menu-sty">
        <!-- <v-menu icon v-bind="attrs">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-filter" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in filItems" :key="i">
              <v-list-item-title style="cursor: pointer;" @click="getFiltVal(item)">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
        <!-- <v-btn
          icon="mdi-magnify"
          @click="searchField.focus()"
        /> -->
        <v-col cols="3">
          <v-text-field
            ref="searchField"
            v-model="searched"
            label="Buscar"
            hide-details
            single-line
            @blur="addSearch()"
          ></v-text-field>
        </v-col>
      </div>

      <ul>
        <TreeNode :node="treeData" :filter="filtered" :search="searched" />
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

      const filtered = ref('');
      const searched = ref('');
      const searchField = ref('');
      const selected = ref([]);
      const loading = ref(false);

      const filItems = [
        { title: 'Nombre', value: 1 },
        { title: 'Fecha', value: 2 },
        { title: 'Archivos', value: 3 },
        { title: 'Carpetas', value: 4 },
        { title: 'Extensión', value: 5 },
      ]

      const getFiltVal = async (filt) => {
        console.log('getFiltVal..............', getFiltVal)
        filtered.value = filt.value
        console.log('filtered.value.................', filtered.value)

        // loading.value = true
        console.log('selected.value.................', selected.value)
        selected.value.push(filt.title)
        console.log('selected.value.................', selected.value)
      }

      const addSearch = async () => {
        // loading.value = true

        console.log('selected.value.................', selected.value)
        if (searched.value) selected.value.push(searched.value)
        console.log('selected.value.................', selected.value)
      }

      return {
        treeData,
        filItems,
        filtered,
        searched,
        searchField,
        selected,
        loading,
        getFiltVal,
        // selections,
        addSearch,
      };
    },
});
</script>

<style scoped>
  .menu-sty {
    text-align: right;
    margin-right: 2%;
  }
</style>
  