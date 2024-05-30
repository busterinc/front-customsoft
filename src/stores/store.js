// En el archivo store.js
import { defineStore } from 'pinia'
import { GetTokenApi } from './api'

export const useAppStore = defineStore('app', {
    state: () => ({
        token: null
    }),
    actions: {
        async GetTokenAct({ commit }) {
            try {
                console.log('&&&&&&&&&&&&&& ENTRA getTokenAct &&&&&&&&&&&&&&&&&')
                const data = await GetTokenApi()
                console.log('data &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', data)

                const token = data.token
                commit('setToken', token) // Llama a la mutación 'setToken' usando commit

                return token
            } catch (error) {
                console.error('Error al obtener el token:', error)
                throw error
            }
        }
    },
    mutations: {
        setToken(state, token) {
            console.log('token %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', token)
            state.token = token
        }
    }
})
