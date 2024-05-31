import { defineStore } from 'pinia'
import {
  TestApi,
  GetTokenApi,
  GetSignInApi,
  UpFileApi,
  GetDocsApi,
  DelDocsApi,
  EditDocsApi,
  DownloadXlsApi
} from './api'

export const useAppStore = defineStore('app', {
  state: () => ({
    dataSession: JSON.parse(localStorage.getItem('dataSession')) || [],
    test: null,
    isLogIn: localStorage.getItem('isLogIn') || false,
    profileId: localStorage.getItem('profileId') || null,
    superUser: localStorage.getItem('superUser') || null,
    token: localStorage.getItem('token') || null,
    docList: JSON.parse(localStorage.getItem('docList')) || [],
    user: JSON.parse(localStorage.getItem('user')) || []
  }),
  // state: () => ({
  //   docList: [],
  //   token: null,
  //   user: null,
  //   superUser: null,
  //   dataSession: [],
  //   test: null,
	// 	isLogIn: false,
	// 	profileId: null
  // }),
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
        localStorage.setItem('superUser', this.superUser)
        this.token = data.token
        localStorage.setItem('token', this.token)
        return data
      } catch (error) {
        console.error('Error fetching token:', error)
        return error
      }
    },
		// async GetTokenAct () {
    //   console.log('&&&&&&&&&&&&&& ENTRA GetTokenAct &&&&&&&&&&&&&&&&&')
    //   try {
    //     const data = await GetTokenApi()
    //     console.log('data &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', data)
    //     this.dataSession = data
    //     console.log('this.dataSession &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', this.dataSession)
		// 		this.superUser = data.users.email
    //   	this.token = data.token
    //     localStorage.setItem('token', this.token);

    //     return data
    //   } catch (error) {
    //     console.error('Error fetching token:', error)
    //     return error
    //   }
    // },
		async GetSignInAct (email, pass) {
      console.log('------------- ENTRA GetSignInAct --------------')
			console.log('email -----------------------------', email)
			console.log('pass -----------------------------', pass)

      try {
				console.log('this.token -----------------------------', this.token)
        const response = this.token ? await GetSignInApi(this.token, email, pass) : null
        console.log('response -----------------------------', response)
				if (response.data) {
					console.log('response.data.key -----------------------------', response.data.key)
					this.isLogIn = response.data.key ? true : false
          localStorage.setItem('logged', this.isLogIn);
					console.log('this.isLogIn -----------------------------', this.isLogIn)
					this.profileId = response.data.key
          localStorage.setItem('id', this.profileId);
					this.user = response.data
          localStorage.setItem('user', JSON.stringify(this.user))
      		
      		
      		
          
          console.log('response.data -----------------------------', response.data)
				} else {
          console.log('response.error -----------------------------', response.error)
          return response.error
        }
        return response
      } catch (error) {
        console.error('Error signin:', error)
        return error
      }
    },
    async UpFileAct (file) {
      console.log('!!!!!!!!!!!! ENTRA UpFileAct !!!!!!!!!!!!!!!')
			console.log('file !!!!!!!!!!!!!', file)
			console.log('this.token !!!!!!!!!!!!!', this.token)

      try {
        const resp = this.token && this.profileId ? await UpFileApi(file, this.token, this.profileId) : null
        console.log('resp !!!!!!!!!!!!!!!!!!!!!!!', resp)
        this.dataSession = resp.data
        console.log('this.dataSession !!!!!!!!!!!!!', this.dataSession)
        return resp
      } catch (error) {
        console.error('Error to upload file:', error)
        return error
      }
    },
    async GetDocsAct () {
      console.log(';;;;;;;;;;;;;;; ENTRA GetDocsAct ;;;;;;;;;;;;;;;')
			console.log('this.token ;;;;;;;;;;;;;;;', this.token)
			console.log('this.profileId ;;;;;;;;;;;;;;;', this.profileId)

      try {
        const payload = (this.token && this.profileId) ? await GetDocsApi(this.token, this.profileId) : null
        console.log('payload ;;;;;;;;;;;;;;;', payload)
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
			console.log('this.token |||||||||||||||||||||', this.token)
			console.log('docId |||||||||||||||||||||', docId)

      try {
        const payload = (this.token && docId) ? await DelDocsApi(this.token, docId) : null
        console.log('payload |||||||||||||||||||||||||', payload)
        return payload
      } catch (error) {
        console.error('Error deleting file:', error)
        return error
      }
    },
    async EditDocsAct (docId, file) {
      console.log(';;;;;;;;;;;;;;; ENTRA EditDocsAct ;;;;;;;;;;;;;;;')
			console.log('this.token ;;;;;;;;;;;;;;;', this.token)
			console.log('docId ;;;;;;;;;;;;;;;', docId)

      try {
        const payload = (this.token && docId) ? await EditDocsApi(this.token, docId) : null
        console.log('payload ;;;;;;;;;;;;;;;', payload)
        return payload
      } catch (error) {
        console.error('Error editing token:', error)
        return error
      }
    },
    async LogOut() {
      console.log('INICIA LOGOUT')

      this.isLogIn = false
			this.profileId = null
			this.user = null
			this.token = null

      localStorage.removeItem('id');
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			localStorage.removeItem('logged');

      console.log('TEMINA LOGOUT')
    },
		async LogIn() {
      this.isLogIn = localStorage.getItem('logged') === 'true' ? true : false;
			this.token = localStorage.getItem('token');
			this.user = localStorage.getItem('user');
			this.profileId = localStorage.getItem('id');
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
