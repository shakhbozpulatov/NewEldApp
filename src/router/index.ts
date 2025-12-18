import { createWebHistory, createRouter } from 'vue-router'
import AuthRoutes from '@/modules/Auth/router'
// import { checkRouteIsExist } from './middleware'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/Default/PIndex.vue'),
      children: [],
    },
    {
      path: '/initial',
      name: 'Initial',
      component: () => import('@/layouts/Initial/PIndex.vue'),
      redirect: { name: 'Companies' },
      children: [
        {
          path: 'companies',
          name: 'Companies',
          component: () => import('@/layouts/Initial/pages/PCompanies.vue'),
        },
        {
          path: 'clients',
          name: 'Clients',
          component: () => import('@/layouts/Initial/pages/PClients.vue'),
        },
      ],
    },
    ...AuthRoutes,
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('@/pages/PError.vue'),
    // },
  ],
})

// router.beforeEach(checkRouteIsExist)

export default router
