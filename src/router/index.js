import { createRouter, createWebHistory } from 'vue-router'
import search from '../views/search.vue'

const routes = [
  {
    path: '/',
    name: 'search',
    component: search
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
