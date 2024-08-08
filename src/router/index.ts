import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import("@/views/Home/Home.vue"),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/Login/Login.vue"),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import("@/views/Result/Result.vue"),
    },
  ]
})

export default router
