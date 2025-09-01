import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Raffle-Page',
      component: () => import('../views/RafflePage.vue'),
      meta: {
        title: 'Raffle Page',
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardPeserta.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/hadiah',
      name: 'Hadiah',
      component: () => import('../views/DashboardHadiah.vue'),
      meta: {
        title: 'Hadiah Dashboard',
      },
    },
    {
      path: '/departement',
      name: 'Departement',
      component: () => import('../views/DashboardDepartement.vue'),
      meta: {
        title: 'Departement Dashboard',
      },
    }
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Kalbe ${to.meta.title} | HUT Kalbe 2025`
  next()
})
