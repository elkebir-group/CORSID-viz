import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Demo.vue')
  },
  { path: '/demo', name: 'Demo', component: () => import('../views/Demo.vue')},
  { path: '/viz/:data_url?', name: 'Viz', component: () => import('../components/Viz.vue')},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router