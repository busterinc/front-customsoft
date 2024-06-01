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
    }
  }
})
