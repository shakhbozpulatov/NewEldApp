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
      path: '/carriers',
      name: 'Carriers',
      component: () => import('@/layouts/Companies/PIndex.vue'),
      children: [],
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
