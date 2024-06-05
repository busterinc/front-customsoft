import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeCustomSoft.vue'
import UploadFile from '../views/UploadFile.vue'
import MyAccount from '../views/MyAccount.vue'
import SignUp from '../views/SignUp.vue'
import TreeDirectory from '../views/TreeDirectory.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/upload-files',
    name: 'UploadFile',
    component: UploadFile
  },
  {
    path: '/my-account',
    name: 'MyAccount',
    component: MyAccount
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/tree',
    name: 'TreeDirectory',
    component: TreeDirectory
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router