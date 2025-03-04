import { defineStore } from 'pinia'
import {
  TestApi,
  GetTokenApi,
  GetSignInApi,
  UpFileApi,
  GetDocsListApi,
  DelDocsApi,
  DownloadXlsApi
} from './api'
import router from '@/router';

export const useAppStore = defineStore('app', {
  state: () => ({
    dataSession: JSON.parse(localStorage.getItem('dataSession')) || [],
    userSession: JSON.parse(localStorage.getItem('userSession')) || [],
    test: null,
    isLogIn: localStorage.getItem('isLogIn') || false,
    profileId: localStorage.getItem('profileId') || null,
    superUser: localStorage.getItem('superUser') || null,
    tokenSession: localStorage.getItem('tokenSession') || null,
    docList: JSON.parse(localStorage.getItem('docList')) || [],
    userEmail: localStorage.getItem('userEmail') || null,
    treeData: {
      "id": "d2c9e8b5a3f6",
      "name": "root",
      "type": "directory",
      "root": true,
      "date": "2021-01-01",
      "icon": "mdi-folder",
      "files": [
        {
          "id": "a3f8c5e9b9d4",
          "name": "downloads",
          "type": "directory",
          "date": "2021-01-05",
          "icon": "mdi-folder",
          "files": [
            {
              "id": "d5b1e9c7e6c8",
              "name": "alien.png",
              "type": "file",
              "date": "2021-01-10",
              "extension": "png",
              "icon": "mdi-file-image"
            },
            {
              "id": "4a1c9d0e7b6f4a1c9e7",
              "name": "file2.txt",
              "type": "file",
              "date": "2021-01-15",
              "extension": "txt",
              "icon": "mdi-file-document-outline"
            },
            {
              "id": "6b2a1d9c8e7f4b3c5d",
              "name": "notes.docx",
              "type": "file",
              "date": "2021-01-20",
              "extension": "docx",
              "icon": "mdi-file-document"
            }
          ]
        },
        {
          "id": "3d2c9e8b5a3f6b2d5a",
          "name": "back_up",
          "type": "directory",
          "date": "2021-01-08",
          "icon": "mdi-folder",
          "files": [
            {
              "id": "b9a8c7d6e5f4a3b2c1",
              "name": "picture.jpg",
              "type": "file",
              "date": "2021-01-12",
              "extension": "jpg",
              "icon": "mdi-file-image-outline"
            },
            {
              "id": "9e8d7c6b5a4f3e2d1",
              "name": "document.pdf",
              "type": "file",
              "date": "2021-01-18",
              "extension": "pdf",
              "icon": "mdi-file-document-outline"
            }
          ]
        },
        {
          "id": "8b0a9a2f9c3e5b7d6b",
          "name": "tutorial_vuejs3.wav",
          "type": "file",
          "date": "2021-01-25",
          "extension": "wav",
          "icon": "mdi-file-music"
        },
        {
          "id": "f4e3d2c1b0a9f8e7d6",
          "name": "work",
          "type": "directory",
          "date": "2021-01-03",
          "icon": "mdi-folder",
          "files": []
        }
      ]
    },
    searchRslt: JSON.parse(localStorage.getItem('searchRslt')) || [],
  }),
  actions: {
    async GetTestAct () {
      try {
        const data = await TestApi()
        context.commit('SetTestMut', data)
      } catch (error) {
        console.error('Error fetching data:', error)
        return error
      }
    },
    async GetTokenAct() {
      console.log('&&&&&&&&&&&&&& ENTRA GetTokenAct &&&&&&&&&&&&&&&&&')
      try {
        const data = await GetTokenApi()
        console.log('data &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', data)
        this.dataSession = data
        localStorage.setItem('dataSession', JSON.stringify(data))
        console.log('this.dataSession &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', this.dataSession)
        this.superUser = data.users.email
        localStorage.setItem('superUser', data.users.email)
        this.tokenSession = data.token
        localStorage.setItem('tokenSession', data.token)
        return data
      } catch (error) {
        console.error('Error fetching token:', error)
        return error
      }
    },

		async GetSignInAct (email, pass) {
      console.log('------------- ENTRA GetSignInAct --------------')
			console.log('email -----------------------------', email)
			console.log('pass -----------------------------', pass)

      try {
				console.log('this.tokenSession -----------------------------', this.tokenSession)
        const response = this.tokenSession ? await GetSignInApi(this.tokenSession, email, pass) : null
        localStorage.setItem('userSession', JSON.stringify(response));
        console.log('response -----------------------------', response)
				if (response.data) {
					console.log('response.data.key -----------------------------', response.data.key)
					this.isLogIn = response.data.key ? true : false
					console.log('this.isLogIn -----------------------------', this.isLogIn)
					this.profileId = response.data.key
					this.userEmail = response.data
      		
      		localStorage.setItem('profileId', response.data.key);
      		localStorage.setItem('isLogIn', response.data.key ? true : false);
          localStorage.setItem('userEmail', response.data.email);
          console.log('response.data.email -----------------------------', response.data.email)
				} else {
          console.log('response.error -----------------------------', response.error)
          return response
        }
        return response
      } catch (error) {
        console.error('Error signin:', error)
        return error
      }
    },
    async UpFileAct (file, type, item) {
      console.log('!!!!!!!!!!!! ENTRA UpFileAct !!!!!!!!!!!!!!!')
			console.log('file !!!!!!!!!!!!!', file)
			console.log('type !!!!!!!!!!!!!', type)
			console.log('item !!!!!!!!!!!!!', item)
			console.log('this.tokenSession !!!!!!!!!!!!!', this.tokenSession)

      try {
        const resp = this.tokenSession && this.profileId ? await UpFileApi(file, this.tokenSession, this.profileId, type, item) : null
        console.log('resp !!!!!!!!!!!!!!!!!!!!!!!', resp)

        const fileInf = resp ? JSON.parse(resp) : null
        console.log('fileInf !!!!!!!!!!!!!!!!!!!!!!!', fileInf)
        if (fileInf.message) await this.GetDocsListAct()

        return fileInf
      } catch (error) {
        console.error('Error to upload file:', error)
        return error
      }
    },
    async GetDocsListAct () {
      console.log(';;;;;;;;;;;;;;; ENTRA GetDocsListAct ;;;;;;;;;;;;;;;')
			console.log('this.tokenSession ;;;;;;;;;;;;;;;', this.tokenSession)
			console.log('this.profileId ;;;;;;;;;;;;;;;', this.profileId)

      try {
        const payload = (this.tokenSession && this.profileId) ? await GetDocsListApi(this.tokenSession, this.profileId) : null
        console.log('payload ;;;;;;;;;;;;;;;', payload)
        localStorage.setItem('docList', JSON.stringify(payload.data));
        this.docList = payload.data //Llenamos state con valor de respuesta d elista de doucmentos
        console.log('this.docList ;;;;;;;;;;;;;;;', this.docList)
        return payload
      } catch (error) {
        console.error('Error al traer lista de docs:', error)
        return error
      }
    },
    async DelDocsAct (docId) {
      console.log('|||||||||||||| ENTRA DelDocsAct |||||||||||||||||||')
			console.log('this.tokenSession |||||||||||||||||||||', this.tokenSession)
			console.log('docId |||||||||||||||||||||', docId)

      try {
        const payload = (this.tokenSession && docId) ? await DelDocsApi(this.tokenSession, docId) : null
        console.log('payload |||||||||||||||||||||||||', payload)

        if (payload.message) await this.GetDocsListAct()

        return payload
      } catch (error) {
        console.error('Error deleting file:', error)
        return error
      }
    },
    async LogOut() {
      console.log('INICIA LOGOUT')

      this.isLogIn = false
			this.profileId = null
			this.userEmail = null
			this.tokenSession = null

      localStorage.clear();

      router.push('/');

      console.log('TEMINA LOGOUT')
    },
		async LogIn() {
      this.isLogIn = localStorage.getItem('isLogIn') === 'true' ? true : false;
			this.tokenSession = localStorage.getItem('tokenSession');
			this.profileId = localStorage.getItem('profileId');
			this.userEmail = localStorage.getItem('userEmail');
			this.userEmail = localStorage.getItem('userEmail');
    },
    async DownloadXlsAct(type) {
      try {
        const payload = await DownloadXlsApi(type)
        console.log('payload°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°', payload)
      } catch (error) {
        console.error('Error:', error.message);
      }
    },

    async DelFoldAct (node) {
      console.log('RemoveDirectoryAct');
      console.log('node', node);

      if (node.root && node.type === 'directory') {
        // Si el nodo es la carpeta raíz, simplemente limpiamos la estructura de datos treeData
        console.log('this.treeData................', this.treeData)
        this.treeData.files = [];
        console.log('this.treeData................', this.treeData)
        console.log('Directory root removed successfully.');
        // return 'Directory root removed successfully.';
        return this.treeData
      } else {
        let removed = false;

        function removeDirectory(files, id) {
          for (let i = 0; i < files.length; i++) {
            const current = files[i];
            if (current.id === id && current.type === 'directory') {
              files.splice(i, 1);
              removed = true;
              return true; // Indicamos que se encontró y eliminó el directorio
            } else if (current.type === 'directory' && current.files.length > 0) {
              // Si es un directorio y tiene archivos, buscamos en ellos
              if (removeDirectory(current.files, id)) {
                return true; // Indicamos que se encontró y eliminó el directorio
              }
            }
          }
          return false; // Indicamos que el directorio no se encontró
        }
        removeDirectory(this.treeData.files, node.id);

        if (removed) {
          console.log('Directory removed successfully.');
          return 'Directory removed successfully.';
        } else {
          console.log('Directory not found.');
          return 'Directory not found.';
        }
      }
    },
    async RenameFoldAct (node, newName) {
      console.log('0000000000000 RenameFoldAct 000000000000')
      const stack = [...this.treeData.files];

      while (stack.length) {
        const current = stack.pop();

        if (current.id === node.id) {
          current.name = newName;
          break;
        } else if (current.type === 'directory') {
          stack.push(...current.files);
        }
      }
    },
    async DelFileAct (node) {
      console.log('0000000000000 DelFileAct 000000000000')
      console.log('node 0000000000000000000000000', node)

      let removed = false;

      async function removeFile(files, id) {
        for (let i = 0; i < files.length; i++) {
          const current = files[i];
          if (current.id === node.id && current.type === 'file') {
            files.splice(i, 1);
            removed = true;
            return true; // Indicamos que se encontró y eliminó el archivo
          } else if (current.type === 'directory' && current.files.length > 0) {
            // Si es un directorio y tiene archivos, buscamos en ellos
            if (removeFile(current.files, id)) {
              return true; // Indicamos que se encontró y eliminó el archivo
            }
          }
        }
        return false; // Indicamos que el archivo no se encontró
      }

      // Buscamos y eliminamos el archivo
      await removeFile(this.treeData.files, node.id);

      if (removed) console.log('File removed successfully.');
      else console.log('File not found.')
    },
    async RenameFileAct (node, newName) {
      console.log('0000000000000 RenameFileAct 000000000000')
      console.log('node 0000000000000000000000000', node)
      console.log('newName 0000000000000000000000000', newName)
      console.log('node.id 0000000000000000000000000', node.id)

      const stack = [...this.treeData.files];

      while (stack.length) {
        const current = stack.pop();

        if (current.id === node.id && current.type === 'file') {
          current.name = newName;
          break;
        } else if (current.type === 'directory') {
          stack.push(...current.files);
        }
      }
    },

    async AddFileAct(parentNode, fileName) {
      const newFile = {
        id: generateRandomId(), // Genera un ID único
        name: fileName,
        type: 'file',
        date: getDate(),
        extension: getXtension(fileName),
        icon: 'mdi-file-document-outline'
      };
      parentNode.files.push(newFile);
      console.log('newFile::', newFile)
      return newFile;
    },
    async AddFoldAct(parentNode, folderName) {
      const newFolder = {
        id: generateRandomId(), // Genera un ID único
        name: folderName,
        type: 'directory',
        date: getDate(),
        icon: 'mdi-folder',
        files: [],
      };
      parentNode.files.push(newFolder);
      console.log('newFolder::', newFolder)
      return newFolder;
    },
    async AddRootAct() {
      this.treeData = {
        id: generateRandomId(), // Genera un ID único
        name: 'root',
        type: 'directory',
        isRoot: true,
        date: getDate(),
        icon: 'mdi-folder',
        files: []
      };
    },
    async GetSerachingAct(searchTerm) {
      console.log('searchTerm:', searchTerm);

      if (!this.treeData || typeof this.treeData !== 'object') {
        console.error('El objeto treeData no está definido o no es válido.');
        return [];
      }
    
      // Iniciamos un array vacío para almacenar los resultados
      let results = [];
    
      // Función recursiva para buscar en el árbol
      async function search(node, term) {
        // Comprobamos si el nombre del nodo contiene el término de búsqueda
        if (node.name.toLowerCase().includes(term.toLowerCase())) {
          results.push(node);
        }
        // Si el nodo tiene archivos dentro, iteramos sobre ellos y los buscamos
        if (node.files && node.files.length > 0) {
          node.files.forEach(childNode => {
            search(childNode, term);
          });
        }
      }
    
      // Llamamos a la función de búsqueda con el árbol y el término de búsqueda
      await search(this.treeData, searchTerm);

      console.log('results ############################', results)
      this.searchRslt = results
      return results
    }
  }
})

const generateRandomId = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let newId = '';
  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    newId += chars[randomIndex];
  }
  console.log('newId:', newId);
  return newId;
}

const getDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Añade cero inicial si es necesario
  const day = String(now.getDate()).padStart(2, '0'); // Añade cero inicial si es necesario

  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);
  return formattedDate
}

const getXtension = (fileName) => {
  const parts = fileName.split('.');
  const extension = parts[parts.length - 1];

  console.log(extension);
  return extension
}
