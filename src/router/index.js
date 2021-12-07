import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

var routes;

if (process.env.VUE_APP_MODE == "singleton") {
  routes = [
    { path: '/', redirect: '/viz/' },
    { path: '/demo', redirect: '/viz/' },
    { path: '/viz/:data_url?', name: 'Viz', component: () => import('../components/Viz.vue') },
  ]
} else {
  routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Demo.vue')
    },
    { path: '/demo', name: 'Demo', component: () => import('../views/Demo.vue')},
    { path: '/viz/:data_url?', name: 'Viz', component: () => import('../components/Viz.vue')},
  ]
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router